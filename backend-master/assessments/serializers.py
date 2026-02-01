from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils import timezone

from .models import AssessmentTemplate, Assignment

User = get_user_model()


# ---------- HR creates an assignment ----------
class AssignRequestSerializer(serializers.ModelSerializer):
    # incoming (write-only)
    employee_email = serializers.EmailField(write_only=True)
    template_code  = serializers.ChoiceField(
        choices=["BIG_FIVE", "KARASEK", "MASLACH"], write_only=True
    )

    # outgoing (read-only from created Assignment)
    id            = serializers.IntegerField(read_only=True)
    template_name = serializers.CharField(source="template.name", read_only=True)
    status        = serializers.CharField(read_only=True)
    assigned_at   = serializers.DateTimeField(read_only=True)

    class Meta:
        model  = Assignment
        fields = [
            "id",
            "employee_email",   # in
            "template_code",    # in
            "template_name",    # out
            "status",           # out
            "assigned_at",      # out
        ]

    def create(self, validated_data):
        hr = self.context["request"].user
        # If you have roles on the user, keep this check
        if hasattr(User, "Roles") and getattr(hr, "role", None) != getattr(User.Roles, "HR", None):
            raise serializers.ValidationError("Only HR can assign assessments.")

        employee_email = validated_data.pop("employee_email")
        template_code  = validated_data.pop("template_code")

        try:
            employee = User.objects.get(email=employee_email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"employee_email": "Employee not found."})

        try:
            template = AssessmentTemplate.objects.get(code=template_code)
        except AssessmentTemplate.DoesNotExist:
            raise serializers.ValidationError({"template_code": "Template not found. Seed templates first."})

        return Assignment.objects.create(
            employee=employee,      # adjust to your FK name (employee/assignee/user)
            template=template,
            assigned_by=hr,         # adjust if your model uses another field name
        )


# ---------- Lists shown to the employee ----------
class AssignmentListItemSerializer(serializers.ModelSerializer):
    template_code = serializers.CharField(source="template.code", read_only=True)
    template_name = serializers.CharField(source="template.name", read_only=True)

    class Meta:
        model  = Assignment
        fields = ["id", "template_code", "template_name", "status", "assigned_at", "completed_at",            "metrics",      # ✅ include scores for Big Five / Karasek / Maslach
            "ai_report",   ]


# ---------- Detail / after submit ----------
class AssignmentDetailSerializer(serializers.ModelSerializer):
    template_code = serializers.CharField(source="template.code", read_only=True)
    template_name = serializers.CharField(source="template.name", read_only=True)

    class Meta:
        model  = Assignment
        # No 'score' here (it crashed). Prefer 'metrics'.
        fields = [
            "id", "template_code", "template_name",
            "status", "assigned_at", "completed_at",
            "answers", "metrics", "ai_report", "report_pdf",
        ]


# ---------- Employee submits answers ----------
# assessments/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import Assignment


class SubmitAnswersSerializer(serializers.Serializer):
    answers    = serializers.JSONField()
    metrics    = serializers.JSONField(required=False)
    ai_report  = serializers.CharField(required=False, allow_blank=True)
    overwrite  = serializers.BooleanField(required=False, default=False)  # <-- NEW

    def validate(self, attrs):
        assignment: Assignment = self.context["assignment"]
        if assignment.status == Assignment.Status.COMPLETED and not attrs.get("overwrite", False):
            raise serializers.ValidationError("Assignment already completed.")
        return attrs

    def create(self, validated_data):
        assignment: Assignment = self.context["assignment"]

        # Upsert fields
        assignment.answers = validated_data.get("answers", {}) or {}
        metrics = validated_data.get("metrics")
        if metrics is None:
            metrics = compute_metrics_for_template(assignment.template.code, assignment.answers)
        assignment.metrics = metrics

        if "ai_report" in validated_data:
            assignment.ai_report = validated_data.get("ai_report") or ""

        # Mark completed (again is fine if overwrite=True)
        from django.utils import timezone
        assignment.status = Assignment.Status.COMPLETED
        assignment.completed_at = timezone.now()
        assignment.save()
        return assignment


def _normalize(value, lo, hi):
    if hi == lo:
        return 0
    return round((value - lo) * 100 / (hi - lo))


def _big_five_metrics(answers: dict) -> dict:
    """
    answers example: { "1": 1..5, 2: 1..5, ... }
    Produces a minimal, stable shape: {"trait": {"N":..,"E":..,"O":..,"A":..,"C":..}}
    """
    # map id->(trait, reverse)
    QUESTIONS = {
        1:("E",False), 2:("C",False), 3:("N",False), 4:("A",False), 5:("O",False),
        6:("E",False), 7:("C",False), 8:("N",False), 9:("A",False), 10:("O",False),
        11:("E",False), 12:("C",False), 13:("N",False), 14:("A",False), 15:("E",True),
        16:("C",False), 17:("N",False), 18:("A",False), 19:("O",False), 20:("E",False),
    }
    totals = {"N":0,"E":0,"O":0,"A":0,"C":0}
    counts = {"N":0,"E":0,"O":0,"A":0,"C":0}

    for qid, (t, rev) in QUESTIONS.items():
        v = answers.get(str(qid), answers.get(qid))
        if v is None:
            continue
        v = int(v)
        score = (6 - v) if rev else v
        totals[t] += score
        counts[t] += 1

    trait = {
        k: _normalize(totals[k], 1*counts[k], 5*counts[k]) if counts[k] else 0
        for k in totals
    }
    return {"trait": trait}


def _karasek_metrics(answers: dict) -> dict:
    """
    Minimal metrics for Karasek: D/C/S (0..100) and a quadrant label.
    Expect 1..4 Likert values, with 'rev' reverse-coded in client or we can repeat here.
    """
    # id -> (sub, rev)
    MAP = {
        # D
        1:("D",False), 2:("D",False), 3:("D",False), 4:("D",False), 5:("D",False),
        6:("D",False), 7:("D",False), 8:("D",True),  9:("D",False),
        # DA
        10:("DA",False), 11:("DA",False), 12:("DA",True), 13:("DA",False),
        14:("DA",False), 15:("DA",True),
        # SD
        16:("SD",False), 17:("SD",False), 18:("SD",False), 19:("SD",True),
        20:("SD",False), 21:("SD",False),
        # SS
        22:("SS",False), 23:("SS",False), 24:("SS",True),
        # SC
        25:("SC",False), 26:("SC",False), 27:("SC",True),
    }
    sums   = {"D":0, "DA":0, "SD":0, "SS":0, "SC":0}
    counts = {"D":0, "DA":0, "SD":0, "SS":0, "SC":0}

    for qid, (sub, rev) in MAP.items():
        v = answers.get(str(qid), answers.get(qid))
        if v is None:
            continue
        v = int(v)
        score = (5 - v) if rev else v  # 1..4 scale
        sums[sub] += score
        counts[sub] += 1

    sub = {
        k: _normalize(sums[k], 1*counts[k], 4*counts[k]) if counts[k] else 0
        for k in sums
    }
    demands = sub["D"]
    control = round((sub["DA"] + sub["SD"]) / 2) if (sub["DA"] or sub["SD"]) else 0
    support = round((sub["SS"] + sub["SC"]) / 2) if (sub["SS"] or sub["SC"]) else 0

    demandHigh  = demands >= 60
    controlHigh = control >= 60
    if demandHigh and controlHigh:
        quadrant = "active"
    elif demandHigh and not controlHigh:
        quadrant = "highStrain"
    elif not demandHigh and not controlHigh:
        quadrant = "passive"
    else:
        quadrant = "lowStrain"

    return {"dim": {"D": demands, "C": control, "S": support}, "sub": sub, "quadrant": quadrant}


def _maslach_metrics(answers: dict) -> dict:
    """
    Placeholder: return minimal structure. Replace with your proper MBI scoring.
    """
    # Example minimal stub to avoid breakage
    return {
        "burnout": {
            "exhaustion": 0,
            "depersonalization": 0,
            "accomplishment": 0,
        }
    }


TEMPLATE_METRIC_FUN = {
    "BIG_FIVE": _big_five_metrics,
    "KARASEK":  _karasek_metrics,
    "MASLACH":  _maslach_metrics,
}

def compute_metrics_for_template(code: str, answers: dict) -> dict:
    fn = TEMPLATE_METRIC_FUN.get(code)
    return fn(answers or {}) if fn else {}
# assessments/serializers.py
from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Assignment, AssessmentTemplate

User = get_user_model()

# ---------- (kept) AssignRequestSerializer / AssignmentListItemSerializer / AssignmentDetailSerializer / SubmitAnswersSerializer ----------
# Use your current versions. Below is ONLY the **new** admin list serializer.

class EmployeeMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "department"]

class AssignmentAdminListSerializer(serializers.ModelSerializer):
    template_code = serializers.CharField(source="template.code", read_only=True)
    template_name = serializers.CharField(source="template.name", read_only=True)
    employee = EmployeeMiniSerializer(read_only=True)

    class Meta:
        model = Assignment
        fields = [
            "id",
            "template_code", "template_name",
            "status", "assigned_at", "completed_at",
            "employee",
            "answers",       # keep if you want to view raw (optional)
            "metrics",       # <-- used by the dashboard aggregations
            "ai_report",     # <-- optional narrative (if provided)
            "report_pdf",    # <-- optional file path/url if you store PDFs
        ]

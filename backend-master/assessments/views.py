from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Assignment
from .serializers import (
    AssignRequestSerializer,
    AssignmentListItemSerializer,
    AssignmentDetailSerializer,
    SubmitAnswersSerializer,
)


class AssignAssessmentView(generics.CreateAPIView):
    """
    HR: POST { "employee_email": "...", "template_code": "BIG_FIVE" }
    """
    serializer_class = AssignRequestSerializer
    permission_classes = [permissions.IsAuthenticated]


class MyAssignmentsView(generics.ListAPIView):
    """
    Employee: GET list of their assignments
    """
    serializer_class = AssignmentListItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Assignment.objects.filter(employee=self.request.user).order_by("-assigned_at")


class AssignmentDetailView(generics.RetrieveAPIView):
    """
    Employee: GET /api/assessments/<id>/
    """
    serializer_class = AssignmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Assignment.objects.filter(employee=self.request.user)


class SubmitAnswersView(generics.GenericAPIView):
    """
    Employee: POST /api/assessments/<id>/submit/  { "answers": {...} }
    """
    serializer_class = SubmitAnswersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        assignment = get_object_or_404(Assignment, pk=pk, employee=request.user)
        if assignment.status == Assignment.Status.COMPLETED:
            return Response({"detail": "Already submitted."}, status=status.HTTP_400_BAD_REQUEST)
        s = self.get_serializer(data=request.data, context={"assignment": assignment})
        s.is_valid(raise_exception=True)
        a = s.save()
        return Response(AssignmentDetailSerializer(a).data, status=status.HTTP_200_OK)
# assessments/views.py
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from .models import Assignment
from .serializers import SubmitAnswersSerializer, AssignmentDetailSerializer

class SubmitAnswersView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubmitAnswersSerializer

    def get_serializer_context(self):
        a = get_object_or_404(Assignment, pk=self.kwargs["pk"], employee=self.request.user)
        return {"assignment": a, **super().get_serializer_context()}

class AssignmentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AssignmentDetailSerializer
    queryset = Assignment.objects.all()

    def get_queryset(self):
        # employee sees only their own; HR can see all
        qs = super().get_queryset()
        user = self.request.user
        if getattr(user, "role", None) == getattr(user.__class__.Roles, "HR", "HR"):
            return qs
        return qs.filter(employee=user)

class UploadReportPDFView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]
    queryset = Assignment.objects.all()
    serializer_class = AssignmentDetailSerializer

    def get_object(self):
        obj = get_object_or_404(Assignment, pk=self.kwargs["pk"], employee=self.request.user)
        return obj

    def put(self, request, *args, **kwargs):
        obj = self.get_object()
        file = request.data.get("file")
        if not file:
            from rest_framework.response import Response
            from rest_framework import status
            return Response({"detail":"file required"}, status=status.HTTP_400_BAD_REQUEST)
        obj.report_pdf = file
        obj.save(update_fields=["report_pdf"])
        return self.retrieve(request, *args, **kwargs)
# assessments/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Assignment, AssessmentTemplate
from .serializers import (
    AssignRequestSerializer,
    AssignmentListItemSerializer,
    AssignmentDetailSerializer,
    SubmitAnswersSerializer,
    AssignmentAdminListSerializer,
)
from .permissions import IsHR

# ---------- Create assignment (HR) ----------
class AssignView(generics.CreateAPIView):
    serializer_class = AssignRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsHR]

# ---------- Employee: list my assignments ----------
class MyAssignmentsView(generics.ListAPIView):
    serializer_class = AssignmentListItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Adjust the FK name if your Assignment uses another field for the user
        return Assignment.objects.filter(employee=self.request.user).select_related("template").order_by("-assigned_at")

# ---------- HR: org-wide list of all assignments (for dashboard) ----------
class AdminAssignmentsListView(generics.ListAPIView):
    """
    Returns ALL assignments in org (HR-only).
    Contains metrics & ai_report for dashboard aggregation.
    """
    serializer_class = AssignmentAdminListSerializer
    permission_classes = [permissions.IsAuthenticated, IsHR]

    def get_queryset(self):
        qs = Assignment.objects.select_related("template", "employee").order_by("-assigned_at")

        # Optional filters
        status = self.request.query_params.get("status")
        template = self.request.query_params.get("template")  # e.g. BIG_FIVE / KARASEK / MASLACH
        employee_email = self.request.query_params.get("employee_email")

        if status:
            qs = qs.filter(status=status)
        if template:
            qs = qs.filter(template__code=template)
        if employee_email:
            qs = qs.filter(employee__email=employee_email)

        return qs


# ---------- Submit answers ----------
class SubmitAnswersView(generics.CreateAPIView):
    """
    POST answers (and optional metrics/ai_report). Marks assignment as COMPLETED.
    Uses serializer validation to block double submit.
    """
    serializer_class = SubmitAnswersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        pk = self.kwargs.get("pk")
        assignment = get_object_or_404(Assignment, pk=pk)
        # Employee can submit only own; HR could POST on behalf if you want—here we restrict to employee
        if assignment.employee != self.request.user and not IsHR().has_permission(self.request, self):
            raise ValidationError("Not allowed to submit for this assignment.")
        ctx["assignment"] = assignment
        return ctx

# ---------- (Optional) upload PDF if you post the generated PDF back ----------
class UploadPDFView(generics.UpdateAPIView):
    """
    PUT/PATCH a 'report_pdf' path/URL (if you render and upload somewhere).
    Payload: {"report_pdf": "https://.../file.pdf"}
    """
    serializer_class = AssignmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = get_object_or_404(Assignment, pk=self.kwargs.get("pk"))
        if obj.employee != self.request.user and not IsHR().has_permission(self.request, self):
            raise ValidationError("Not allowed.")
        return obj

    def update(self, request, *args, **kwargs):
        assignment = self.get_object()
        report_pdf = request.data.get("report_pdf")
        if not report_pdf:
            raise ValidationError({"report_pdf": "This field is required."})
        assignment.report_pdf = report_pdf
        assignment.save(update_fields=["report_pdf"])
        ser = self.get_serializer(assignment)
        return Response(ser.data)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from langchain_community.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv
from assessments.models import Assignment  # adjust to your app
from django.conf import settings
load_dotenv()

class GenerateHRReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Optionally get all assessment data from DB
        assignments = Assignment.objects.select_related("employee", "template").all()

        assessment_data = []
        for a in assignments:
            print(a)
            assessment_data.append({
                "employee": str(a.employee),
                "template": a.template.code,
                "status": a.status,
                "score": a.metrics,
            })
        print (assessment_data)
        # Load vectorstore
        index_path = os.path.join(settings.BASE_DIR, "assessments", "media", "pdf_index")

        


        prompt = f"""
        You are a senior HR consultant. Based on the psychological assessment data below, generate a comprehensive decision-support report for HR leadership. Do not include these instructions in the report itself. Make sure the report does not contain any '#' or '**' symbols; only use headings, bullet points, and normal text formatting.

        Objective:
        Provide strategic insights and concrete recommendations to help the HR department understand employees' psychological profiles and take action to improve well-being, engagement, and performance.

        Assessment Data:
        {assessment_data}

        Guidelines:

        1. Summarize Key Trends
        - Overall mental health state of the organization.
        - Distribution across assessment types (BIG_FIVE, KARASEK, MASLACH).
        - Detect patterns like high stress, burnout, lack of motivation, etc.

        2. Deep Analysis
        - Highlight at-risk individuals or groups.
        - Cross-compare assessments if possible (e.g. stress + low agreeableness).

        3. Actionable Recommendations
        - Tailored advice for HR: trainings, coaching, reorganization.
        - Burnout prevention and mental wellness initiatives.
        - Cultural or leadership improvements.
        - Suggestions per department if relevant.

        4. Reference Best Practices
        - Mention key psychological models from the uploaded knowledge PDFs.
        - Justify suggestions using evidence from known psychological research.

        5. Tone
        - Use clear, supportive language.
        - Structure the report with headings and paragraphs.
        - Write in a way suitable to be shared directly with HR leadership.

        End the report with a next-step checklist for HR.
        """


		
# ---------- Detail ----------
class AssignmentDetailView(generics.RetrieveAPIView):
    serializer_class = AssignmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        # HR can read any; employee can read only own
        base = Assignment.objects.select_related("template", "employee")
        user = self.request.user
        if IsHR().has_permission(self.request, self):
            return base
        return base.filter(employee=user)
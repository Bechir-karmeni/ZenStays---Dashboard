from uuid import UUID

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import Invite

User = get_user_model()


# ---------- HR self-signup ----------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "department",]

    def create(self, validated_data):
        # Default self-service signups to HR
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            department=validated_data.get("department", ""),
            role=User.Roles.HR,
        )


# ---------- HR creates invite ----------
class InviteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invite
        fields = ["id", "email", "department", "first_name", "last_name"]

    def create(self, validated_data):
        user = self.context["request"].user
        if user.role != User.Roles.HR:
            raise serializers.ValidationError("Only HR can create invites.")
        return Invite.objects.create(created_by=user, **validated_data)


# ---------- Employee accepts invite ----------
class AcceptInviteSerializer(serializers.Serializer):
    # Inputs (write-only)
    token = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    last_name = serializers.CharField(required=False, allow_blank=True, write_only=True)

    # Output
    email = serializers.EmailField(read_only=True)

    def validate_password(self, value):
        # Apply Django password validators
        validate_password(value)
        return value

    def validate(self, attrs):
        raw = (attrs.get("token") or "").strip()

        # Ensure UUID format
        try:
            tok = str(UUID(raw))
        except ValueError:
            raise serializers.ValidationError({"token": "Invalid token format."})

        try:
            invite = Invite.objects.get(id=tok)
        except Invite.DoesNotExist:
            raise serializers.ValidationError({"token": "Invite not found."})

        if invite.is_accepted:
            raise serializers.ValidationError({"token": "Invite already used."})

        attrs["invite"] = invite
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        invite: Invite = validated_data["invite"]

        user = User.objects.create_user(
            email=invite.email,
            password=validated_data["password"],
            first_name=validated_data.get("first_name") or invite.first_name,
            last_name=validated_data.get("last_name") or invite.last_name,
            department=invite.department,
            role=User.Roles.EMPLOYEE,
        )

        invite.is_accepted = True
        invite.save(update_fields=["is_accepted"])

        return {"email": user.email}


# ---------- Current user ----------
class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "department",
            "phone",
            "location",
            "bio",
            "join_date",
            "gender",
            "date_of_birth",
            "nationality",
            "marital_status",
        ]


# ---------- User list for HR ----------
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "department",
            "is_active",
            "date_joined",
        ]
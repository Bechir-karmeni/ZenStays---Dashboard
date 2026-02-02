from uuid import UUID

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import Invite

User = get_user_model()


# ---------- Admin creates invite ----------
class InviteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invite
        fields = ["id", "email", "first_name", "last_name"]

    def create(self, validated_data):
        user = self.context["request"].user
        return Invite.objects.create(created_by=user, **validated_data)


# ---------- Client accepts invite ----------
class AcceptInviteSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    last_name = serializers.CharField(required=False, allow_blank=True, write_only=True)

    email = serializers.EmailField(read_only=True)

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        raw = (attrs.get("token") or "").strip()

        if not raw:
            raise serializers.ValidationError({"detail": "Missing invite token."})

        try:
            tok = str(UUID(raw))
        except ValueError:
            raise serializers.ValidationError({"detail": "Invalid token format."})

        try:
            invite = Invite.objects.get(id=tok)
        except Invite.DoesNotExist:
            raise serializers.ValidationError({"detail": "Invite not found."})

        if invite.is_accepted:
            raise serializers.ValidationError({"detail": "This invite has already been used."})

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
            role=User.Roles.CLIENT,
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
            "phone",
            "location",
            "bio",
            "join_date",
        ]


# ---------- User list for Admin ----------
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_active",
            "date_joined",
        ]
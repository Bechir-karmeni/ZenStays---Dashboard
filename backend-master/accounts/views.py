from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import (
    SignupSerializer, InviteCreateSerializer, AcceptInviteSerializer, UserMeSerializer
)

User = get_user_model()

class SignupView(generics.CreateAPIView):
    """
    Public endpoint: HR self-signup (your current form).
    """
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class InviteCreateView(generics.CreateAPIView):
    """
    HR-only: create an invite for an Employee.
    """
    serializer_class = InviteCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class AcceptInviteView(generics.CreateAPIView):
    """
    Public: employee completes account with token + password.
    """
    serializer_class = AcceptInviteSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    ### this for show
    def get(self, request):
        return Response(UserMeSerializer(request.user).data)
    ### this for update 
    def patch(self, request):
        serializer = UserMeSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework import generics, permissions
from .serializers import UserListSerializer

class IsHR(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", "") == User.Roles.HR

class UsersListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsHR]

    def get_queryset(self):
        return User.objects.all().order_by("-date_joined")

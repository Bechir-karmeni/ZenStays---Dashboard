from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, InviteCreateView, AcceptInviteView, MeView, UsersListView, UserDeleteView

urlpatterns = [
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="me"),
    path("invites/", InviteCreateView.as_view(), name="invite-create"),
    path("invites/accept/", AcceptInviteView.as_view(), name="invite-accept"),
    path("users/", UsersListView.as_view(), name="users-list"),
    path("users/<int:pk>/", UserDeleteView.as_view(), name="user-delete"),  # ADD THIS
]
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import InviteCreateView, AcceptInviteView, MeView, UsersListView, UserDeleteView

urlpatterns = [
    # Auth (login only, no signup)
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", MeView.as_view(), name="me"),

    # Invitations
    path("invites/", InviteCreateView.as_view(), name="invite-create"),
    path("invites/accept/", AcceptInviteView.as_view(), name="invite-accept"),

    # User management
    path("users/", UsersListView.as_view(), name="users-list"),
    path("users/<int:pk>/", UserDeleteView.as_view(), name="user-delete"),
]
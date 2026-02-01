# assessments/urls.py
from django.urls import path
from .views import AssignAssessmentView, GenerateHRReportView, MyAssignmentsView, AssignmentDetailView, SubmitAnswersView,UploadReportPDFView,AdminAssignmentsListView

urlpatterns = [
    path("assessments/assign/", AssignAssessmentView.as_view(), name="assessments-assign"),
    path("assessments/my/", MyAssignmentsView.as_view(), name="assessments-my"),
    path("assessments/<int:pk>/", AssignmentDetailView.as_view(), name="assessments-detail"),
    path("assessments/<int:pk>/submit/", SubmitAnswersView.as_view(), name="assessments-submit"),
    path("assessments/<int:pk>/upload-pdf/", UploadReportPDFView.as_view(), name="assessments-upload-pdf"),
    path("assessments/admin/", AdminAssignmentsListView.as_view(), name="assessments-admin"),
    path("assessments/admin/", AdminAssignmentsListView.as_view(), name="assessments-admin"),
    path("hr/report/", GenerateHRReportView.as_view()),

]

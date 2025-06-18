from django.urls import path
from .views import RegisterView, LoginAPIView, ClinicManagementView


urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/doctor/profile/', ClinicManagementView.as_view()),
]


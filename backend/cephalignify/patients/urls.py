from django.urls import path
from .views import CreatePatientView

urlpatterns = [
  path('api/patients/', CreatePatientView.as_view(), name='create_patient'),
]

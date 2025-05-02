from rest_framework import generics, permissions
from .models import Patient
from .serializers import PatientSerializer

class CreatePatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]



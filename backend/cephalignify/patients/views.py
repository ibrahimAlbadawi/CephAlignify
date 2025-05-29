from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()  
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # The secretary can only view patients from their own clinic
        user = self.request.user
        return Patient.objects.filter(clinic=user.clinic)

    def perform_create(self, serializer):
        user = self.request.user
        # Only the secretary is allowed to create a patient record
        if user.role != 'secretary':
            raise PermissionDenied("Only the secretary can create a patient.")
        # Automatically assign the patient to the secretary's clinic
        serializer.save(clinic=user.clinic)

    def perform_update(self, serializer):
        user = self.request.user
        patient = self.get_object()
        # Only the secretary can update patient information
        if user.role != 'secretary':
            raise PermissionDenied("Only the secretary can update patient data.")
        # Prevent secretary from editing patients outside their clinic
        if patient.clinic != user.clinic:
            raise PermissionDenied("You cannot update a patient from another clinic.")
        serializer.save()


    def retrieve(self, request, *args, **kwargs):
        patient = self.get_object()
        # Secretaries can only retrieve patients from their own clinic
        if request.user.role == 'secretary' and patient.clinic != request.user.clinic:
            raise PermissionDenied("You cannot view a patient from another clinic.")
        return super().retrieve(request, *args, **kwargs)





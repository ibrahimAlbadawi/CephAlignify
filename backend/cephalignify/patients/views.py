from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()  
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Patient.objects.filter(clinic=user.clinic)

    def create(self, serializer):
        user = self.request.user
        if user.role != 'secretary':
            raise PermissionDenied("Only the secretary can create a patient.")
        serializer.save(clinic=user.clinic)

    def update(self, serializer):
        user = self.request.user
        patient = self.get_object()
        if user.role != 'secretary':
            raise PermissionDenied("Only the secretary can update patient data.")
        if patient.clinic != user.clinic:
            raise PermissionDenied("You cannot update a patient from another clinic.")
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        patient = self.get_object()
        if request.user.role == 'secretary' and patient.clinic != request.user.clinic:
            raise PermissionDenied("You cannot view a patient from another clinic.")
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Patient created successfully.',
            'data': response.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'success': True,
            'message': 'Patient updated successfully.',
            'data': response.data
        }, status=status.HTTP_200_OK)

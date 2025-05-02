from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from users.permissions import IsSecretary, PermissionDenied

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsSecretary]  # Only secretaries can modify appointments

    def perform_create(self, serializer):
        # Allow secretaries to create appointments only
        if self.request.user.role != 'secretary':
            raise PermissionDenied("You are not authorized to create an appointment.")
        serializer.save()

    def perform_update(self, serializer):
        # Allow secretaries to update appointments only
        if self.request.user.role != 'secretary':
            raise PermissionDenied("You are not authorized to update this appointment.")
        serializer.save()

    def perform_destroy(self, instance):
        # Allow secretaries to delete appointments only
        if self.request.user.role != 'secretary':
            raise PermissionDenied("You are not authorized to delete this appointment.")
        instance.delete()

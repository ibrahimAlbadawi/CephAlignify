from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Appointment
from datetime import date
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        today = date.today()

        if user.role == 'secretary':
            return Appointment.objects.filter(clinic=user.clinic)

        elif user.role == 'doctor':
            return Appointment.objects.filter(clinic=user.clinic, DateAndTime__date=today)

        return Appointment.objects.none()

    def has_write_permission(self):
        return self.request.user.role == 'secretary'

    def create(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can create appointments.")
        response = super().create(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Appointment created successfully.",
            "data": response.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can update appointments.")
        response = super().update(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Appointment updated successfully.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can delete appointments.")
        appointment = self.get_object()
        if appointment.clinic != self.request.user.clinic:
            raise PermissionDenied("You do not have permission to delete this appointment.")
        appointment.delete()
        return Response({
            "success": True,
            "message": "Appointment deleted successfully."
        }, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(clinic=self.request.user.clinic)

    def perform_update(self, serializer):
        appointment = self.get_object()

        if appointment.clinic != self.request.user.clinic:
            raise PermissionDenied("You do not have permission to edit this appointment.")

        if hasattr(appointment, 'visit'):
            raise PermissionDenied("Cannot edit an appointment that has an associated visit.")

        serializer.save()

    def perform_destroy(self, instance):
        if instance.clinic != self.request.user.clinic:
            raise PermissionDenied("You do not have permission to delete this appointment.")

        if hasattr(instance, 'visit'):
            raise PermissionDenied("Cannot delete an appointment that has an associated visit.")

        instance.delete()

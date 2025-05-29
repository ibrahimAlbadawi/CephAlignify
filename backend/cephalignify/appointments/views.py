from rest_framework import viewsets, permissions
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
        # السكرتير يرى كل المواعيد المرتبطة بعيادته
            return Appointment.objects.filter(clinic=user.clinic)

        elif user.role == 'doctor':
        # الطبيب يرى فقط مواعيد اليوم
            return Appointment.objects.filter(clinic=user.clinic, DateAndTime__date=today)

        return Appointment.objects.none()

    def has_write_permission(self):
        # فقط السكرتير يمكنه تعديل/إنشاء/حذف
        return self.request.user.role == 'secretary'

    def create(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can create appointments.")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can update appointments.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can update appointments.")
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not self.has_write_permission():
            raise PermissionDenied("Only secretaries can delete appointments.")
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(clinic=self.request.user.clinic)

    def perform_update(self, serializer):
        appointment = self.get_object()
        if appointment.clinic != self.request.user.clinic:
            raise PermissionDenied("You do not have permission to edit this appointment.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.clinic != self.request.user.clinic:
            raise PermissionDenied("You do not have permission to delete this appointment.")
        instance.delete()

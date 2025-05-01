from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from users.permissions import IsSecretary

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsSecretary]
    
    def get_queryset(self):
        # السكرتير يعرض فقط المواعيد المتعلقة بالعيادة التي ينتمي إليها
        user = self.request.user
        return Appointment.objects.filter(clinic=user.clinic)




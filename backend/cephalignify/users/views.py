# views.py
from rest_framework import viewsets
from .models import Appointment, Visit, Patient
from .serializers import AppointmentSerializer, VisitSerializer, PatientSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSecretary  # صلاحية السكرتير

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsSecretary]  # استخدام الصلاحية هنا

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]  # يمكن إضافة صلاحيات أخرى

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]  # هنا يمكن تحديد صلاحيات أخرى إذا كنت تريد

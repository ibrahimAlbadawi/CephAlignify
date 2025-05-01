from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Patient
from .serializers import PatientSerializer
from users.permissions import IsSecretary

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsSecretary]
    
    def get_queryset(self):
        # عرض المرضى فقط في العيادة التي ينتمي إليها السكرتير
        user = self.request.user
        return Patient.objects.filter(clinic=user.clinic)

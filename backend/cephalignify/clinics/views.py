from rest_framework import viewsets
from .models import Clinic
from .serializers import ClinicSerializer
from users.permissions import IsDoctor

class ClinicViewSet(viewsets.ModelViewSet):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return Clinic.objects.filter(id=self.request.user.clinic_id)

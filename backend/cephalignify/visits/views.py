from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Visit
from .serializers import VisitSerializer
from users.permissions import IsSecretary

class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated, IsSecretary]

    def get_queryset(self):
        # السكرتير يعرض فقط الزيارات المتعلقة بالعيادة
        user = self.request.user
        return Visit.objects.filter(patient__clinic=user.clinic)

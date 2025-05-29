from rest_framework import generics, permissions, viewsets
from .models import Visit
from .serializers import VisitSerializer
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

class VisitViewSet(viewsets.ModelViewSet):
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Only the doctor can view visits from their clinic
        if user.role != 'doctor':
            raise PermissionDenied("Only the doctor can view visits.")
        return Visit.objects.filter(patient__clinic=user.clinic)

    def perform_create(self, serializer):
        user = self.request.user
        # Only the doctor can create a visit
        if user.role != 'doctor':
            raise PermissionDenied("Only the doctor can create a visit.")
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        # Only the doctor can update a visit
        if user.role != 'doctor':
            raise PermissionDenied("Only the doctor can update a visit.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        # Only the doctor can delete a visit
        if user.role != 'doctor':
            raise PermissionDenied("Only the doctor can delete a visit.")
        instance.delete()

    def retrieve(self, request, *args, **kwargs):
        visit = self.get_object()
        # Only the doctor can retrieve visits
        if request.user.role != 'doctor':
            raise PermissionDenied("Only the doctor can view this visit.")
        return super().retrieve(request, *args, **kwargs)


class CreateVisitView(generics.CreateAPIView):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]


class TodayVisitsView(generics.ListAPIView):
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]

 

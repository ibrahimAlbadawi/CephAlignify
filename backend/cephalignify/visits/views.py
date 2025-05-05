from rest_framework import generics, permissions
from .models import Visit
from .serializers import VisitSerializer
from django.utils.timezone import now

class CreateVisitView(generics.CreateAPIView):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]


class TodayVisitsView(generics.ListAPIView):
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        today = now().date()
        return Visit.objects.filter(DateAndTime__date=today)

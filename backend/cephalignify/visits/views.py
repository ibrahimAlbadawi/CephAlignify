from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .serializers import VisitSerializer
from cephalignify.appointments.models import Appointment

class FillVisitView(APIView):
    serializer_class = VisitSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        user = request.user

        if user.role != 'doctor':
            raise PermissionDenied("Only doctors can fill visits.")

        try:
            appointment = Appointment.objects.get(id=appointment_id, clinic=user.clinic)
        except Appointment.DoesNotExist:
            return Response({"detail": "Appointment not found."}, status=404)

        if hasattr(appointment, 'visit'):
            return Response({"detail": "Visit already filled for this appointment."}, status=400)

        data = request.data.copy()
        data['DateAndTime'] = appointment.DateAndTime
        data['patient'] = appointment.patient.id
        data['appointment'] = appointment.id 

        serializer = VisitSerializer(data=data)
        if serializer.is_valid():
            visit = serializer.save()
            appointment.is_completed = True
            appointment.save()
            return Response({
                "success": True,
                "message": "Visit filled successfully.",
                "data": VisitSerializer(visit).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

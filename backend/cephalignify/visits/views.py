from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .serializers import VisitSerializer
from cephalignify.appointments.models import Appointment

class FillVisitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        user = request.user

        # السماح فقط للطبيب بتعبئة الزيارة
        if user.role != 'doctor':
            raise PermissionDenied("Only doctors can fill visits.")

        # جلب الموعد من قاعدة البيانات والتأكد أنه من نفس العيادة
        try:
            appointment = Appointment.objects.get(id=appointment_id, clinic=user.clinic)
        except Appointment.DoesNotExist:
            return Response({"detail": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)

        # التأكد من أن الزيارة لهذا الموعد لم تُملأ سابقاً
        if hasattr(appointment, 'visit'):
            return Response({"detail": "Visit already filled for this appointment."}, status=status.HTTP_400_BAD_REQUEST)

        # نسخ بيانات الطلب وإضافة بيانات الموعد والمريض للزيارة
        data = request.data.copy()
        data['appointment'] = appointment.id
        data['patient'] = appointment.patient.id
        data['DateAndTime'] = appointment.DateAndTime

        serializer = VisitSerializer(data=data)
        if serializer.is_valid():
            visit = serializer.save()  # حفظ الزيارة
            appointment.is_completed = True  # تحديث حالة الموعد
            appointment.save()

            return Response({
                "success": True,
                "message": "Visit filled successfully.",
                "data": VisitSerializer(visit).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

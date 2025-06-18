from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound
from .serializers import VisitSerializer
from cephalignify.appointments.models import Appointment


class AppointmentVisitAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, appointment_id, user):
        try:
            return Appointment.objects.get(id=appointment_id, patient__clinic=user.clinic)
        except Appointment.DoesNotExist:
            raise NotFound({
                "success": False,
                "message": "Appointment not found."
            })

    def prepare_data(self, request, appointment):
        data = request.data.copy()
        data['appointment'] = appointment.id
        return data

    def get(self, request, appointment_id):
        user = request.user

        if user.role != 'doctor':
            raise PermissionDenied({
                "success": False,
                "message": "Only doctors can access visits."
            })

        appointment = self.get_object(appointment_id, user)
        visit = getattr(appointment, 'visit', None)

        if not visit:
            return Response({
                "success": False,
                "message": "Visit not found for this appointment."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = VisitSerializer(visit)
        return Response({
            "success": True,
            "message": "Visit retrieved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, appointment_id):
        user = request.user

        if user.role != 'doctor':
            raise PermissionDenied({
                "success": False,
                "message": "Only doctors are allowed to create visits."
            })

        try:
            appointment = Appointment.objects.get(id=appointment_id, patient__clinic=user.clinic)
        except Appointment.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Appointment not found.'
            }, status=status.HTTP_404_NOT_FOUND)

        if hasattr(appointment, 'visit'):
            return Response({
                'success': False,
                'message': 'A visit already exists for this appointment.'
            }, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['appointment'] = appointment.id

        serializer = VisitSerializer(data=data)
        if serializer.is_valid():
            visit = serializer.save()
            return Response({
                "success": True,
                "message": "Visit created successfully.",
                "data": VisitSerializer(visit).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "Invalid visit data.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, appointment_id):
        user = request.user

        if user.role != 'doctor':
            raise PermissionDenied({
                "success": False,
                "message": "Only doctors can update visits."
            })

        appointment = self.get_object(appointment_id, user)
        visit = getattr(appointment, 'visit', None)

        if not visit:
            return Response({
                "success": False,
                "message": "Visit not found for this appointment."
            }, status=status.HTTP_404_NOT_FOUND)

        data = self.prepare_data(request, appointment)

        serializer = VisitSerializer(visit, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Visit updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Visit update failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, appointment_id):
        user = request.user

        if user.role != 'doctor':
            raise PermissionDenied({
                "success": False,
                "message": "Only doctors can update visits."
            })

        appointment = self.get_object(appointment_id, user)
        visit = getattr(appointment, 'visit', None)

        if not visit:
            return Response({
                "success": False,
                "message": "Visit not found for this appointment."
            }, status=status.HTTP_404_NOT_FOUND)

        data = self.prepare_data(request, appointment)

        serializer = VisitSerializer(visit, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Visit updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Update failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

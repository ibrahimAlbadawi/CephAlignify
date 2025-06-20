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


#-------------------------DeepSeek-------------------------#
import os
import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def deepseek_chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")

            if not user_message:
                return JsonResponse({"error": "Message is required"}, status=400)

            headers = {
                "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://127.0.0.1:8000/",  #عند رفع الموقع الى سيرفر يوضع مكانه رابط الموقع 
                "X-Title": "MyDjangoApp"
            }

            payload = {
                "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
                "messages": [
                    {"role": "user", "content": user_message}
                ]
            }

            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                data=json.dumps(payload)
            )

            response.raise_for_status()  # يُظهر الخطأ لو حدث

            reply = response.json()['choices'][0]['message']['content']
            return JsonResponse({"reply": reply})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST method required"}, status=405)

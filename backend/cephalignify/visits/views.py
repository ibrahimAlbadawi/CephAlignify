from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound

from cephalignify.analysis.models import Analysis
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
def deepseek_chat(request, analysis_id):
    if request.method == "POST":
        analysis = Analysis.objects.get(id=analysis_id)
        try:
            # اقرأ محتوى تقرير ستاينر النصي
            steiner_text = ""
            if analysis.steiner_report:
                with analysis.steiner_report.open("r", encoding="utf-8") as f:
                    steiner_text = f.read()

            # برومبت ثابت مع إضافة محتوى التقرير
            prompt = f"""
Please analyze the provided cephalometric X-ray image, which includes anatomical landmarks and measured angles in degrees from the accompanying text file below.

{steiner_text}

Based on these inputs, provide a comprehensive diagnostic summary of the patient’s skeletal and dental relationships in no more than 60 words.
"""

            headers = {
                "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://127.0.0.1:8000/",  # غيّر إلى رابط موقعك بعد النشر
                "X-Title": "MyDjangoApp"
            }

            payload = {
                "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }

            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                data=json.dumps(payload)
            )

            response.raise_for_status()

            reply = response.json()['choices'][0]['message']['content']

            
            if hasattr(analysis, 'visit'):
             visit = analysis.visit
             visit.Analysis_diagnosis = reply
             visit.save()


            return JsonResponse({"reply": reply})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST method required"}, status=405)

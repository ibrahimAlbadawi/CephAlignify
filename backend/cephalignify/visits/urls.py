from django.urls import path
from cephalignify.visits.views import AppointmentVisitAPIView
from .views import deepseek_chat

urlpatterns = [
    path('api/appointments/<int:appointment_id>/visit/',
          AppointmentVisitAPIView.as_view(), name='appointment-visit'),

]






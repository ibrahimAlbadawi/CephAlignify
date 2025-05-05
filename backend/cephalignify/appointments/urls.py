# appointments/urls.py
from django.urls import path
from .views import AppointmentViewSet

urlpatterns = [
    path('', AppointmentViewSet.as_view(), name='appointments'),
]

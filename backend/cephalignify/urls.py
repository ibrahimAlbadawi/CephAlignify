"""
URL configuration for cephalignify project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, ) 

from django.http import HttpResponse
from rest_framework import routers
from cephalignify.appointments.views import AppointmentViewSet
from cephalignify.patients.views import PatientViewSet
from cephalignify.users.views import LoginAPIView, RegisterView
from cephalignify.visits.views import FillVisitView

def home(request):
    return HttpResponse("Home page")

router = routers.DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patients')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('', home),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('appointments/<int:appointment_id>/fill-visit/',
          FillVisitView.as_view(), name='fill-visit'),

]                           






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
from cephalignify.analysis.views import AnalysisMeasurementsAPIView, StartAnalysisAPIView, SteinerImageAPIView, deepseek_chat, UpdateAnalysisAPIView
from cephalignify.appointments.views import AppointmentViewSet
from cephalignify.users.views import LoginAPIView, RegisterView, ClinicManagementView
from cephalignify.visits.views import AppointmentVisitAPIView

from django.conf import settings
from django.conf.urls.static import static



def home(request):
    return HttpResponse("Home page")

router = routers.DefaultRouter()
# router.register(r'patients', PatientViewSet, basename='patients') #Ibrahim commented this line
router.register(r'appointments', AppointmentViewSet, basename='appointment')

# urlpatterns = [
#     path('api/', include(router.urls)),
#     path('admin/', admin.site.urls),
#     path('', home),
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('api/register/', RegisterView.as_view(), name='register'),
#     path('api/login/', LoginAPIView.as_view(), name='login'),
#     path('appointments/<int:appointment_id>/fill-visit/',
#           FillVisitView.as_view(), name='fill-visit'),

# ]

#ibrahim added this
urlpatterns = [
    path('api/', include(router.urls)),  # appointments & other registered views
    path('api/', include('cephalignify.patients.urls')),  # ✅ include patient routes here
    path('admin/', admin.site.urls),
    path('', home),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    path('api/doctor/profile/', ClinicManagementView.as_view()),
    path('api/appointments/<int:appointment_id>/visit/',
           AppointmentVisitAPIView.as_view(), name='appointment-visit'),
    path('api/start-analysis/<int:visit_id>/', StartAnalysisAPIView.as_view(), name='start-analysis'),
    path('api/deepseek-chat/', deepseek_chat, name='deepseek_chat'),
    path('api/analysis/measurements/<int:analysis_id>/', AnalysisMeasurementsAPIView.as_view(), name='analysis-measurements'),
    path('api/steiner-image/<int:analysis_id>/', SteinerImageAPIView.as_view(), name='steiner-image'),
    path('api/update-analysis/<int:visit_id>/', UpdateAnalysisAPIView.as_view(), name='update-analysis'),


]  
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)                     






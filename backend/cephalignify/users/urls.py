from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from cephalignify.analysis import admin
from .views import AppointmentViewSet, VisitViewSet, PatientViewSet


router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'visits', VisitViewSet)
router.register(r'patients', PatientViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),  # مسارات لجميع الـ API
]



from django.urls import path
from .views import RegisterView, LoginAPIView


urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
]


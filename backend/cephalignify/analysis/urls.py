from django.urls import path
from .views import StartAnalysisAPIView

urlpatterns = [
    path('start-analysis/<int:visit_id>/', StartAnalysisAPIView.as_view(), name='start-analysis'),
]

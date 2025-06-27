from django.urls import path
from .views import (
    AnalysisMeasurementsAPIView,
    StartAnalysisAPIView,
    SteinerImageAPIView,
    deepseek_chat,
    UpdateAnalysisAPIView,
)

urlpatterns = [
    path('api/start-analysis/<int:visit_id>/', StartAnalysisAPIView.as_view(), name='start-analysis'),
    path('api/deepseek-chat/', deepseek_chat, name='deepseek_chat'),
    path('api/analysis/measurements/<int:analysis_id>/', AnalysisMeasurementsAPIView.as_view(), name='analysis-measurements'),
    path('api/steiner-image/<int:analysis_id>/', SteinerImageAPIView.as_view(), name='steiner-image'),
    path('api/update-analysis/<int:visit_id>/', UpdateAnalysisAPIView.as_view(), name='update-analysis'),
]

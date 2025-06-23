from django.urls import path
from .views import AnalysisMeasurementsAPIView, StartAnalysisAPIView, SteinerImageAPIView

urlpatterns = [
    path('start-analysis/<int:visit_id>/', StartAnalysisAPIView.as_view(), name='start-analysis'),
    path('api/analysis/measurements/<int:analysis_id>/', AnalysisMeasurementsAPIView.as_view(), name='analysis-measurements'),
    path('api/steiner-image/<int:analysis_id>/', SteinerImageAPIView.as_view(), name='steiner-image'),
]

from django.urls import path
from .views import FillVisitView

urlpatterns = [
    path('appointments/<int:appointment_id>/fill-visit/',
          FillVisitView.as_view(), name='fill-visit'),
]

from django.urls import path
from .views import CreateVisitView, TodayVisitsView

urlpatterns = [
    path('api/visits/', CreateVisitView.as_view(), name='create_visit'),
    path('api/visits/today/', TodayVisitsView.as_view(), name='today_visits'),
]

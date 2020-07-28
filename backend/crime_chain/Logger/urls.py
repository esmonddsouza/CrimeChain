"""
URLs to access djangos APIs
"""

from django.urls import path, include
from rest_framework import routers
from .views import EventLogView 


urlpatterns = [
    path('eventLogger', EventLogView.as_view(), name="EL")
]

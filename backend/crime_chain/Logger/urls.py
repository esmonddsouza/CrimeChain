"""
URLs to access djangos APIs
"""

from django.urls import path, include
from rest_framework import routers
from .views import EventLogView, RoleAssignmentLogView


urlpatterns = [
    path('eventLogger', EventLogView.as_view(), name="EL"),
    path('roleAssignmentLogger', RoleAssignmentLogView.as_view(), name="RAL")
]

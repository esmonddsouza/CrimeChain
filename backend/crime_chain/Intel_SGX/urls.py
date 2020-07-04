"""
URLs to access djangos APIs
"""


from django.urls import path, include
from rest_framework import routers
from .views import SGXRAView


urlpatterns = [
    path('sgx/ra', SGXRAView.as_view(), name="RA")
]

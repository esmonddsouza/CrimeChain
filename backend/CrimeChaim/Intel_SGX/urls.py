"""
URLs to access djangos APIs
"""


from django.urls import path
from .views import RemotelyAttestSGXEnclave

urlpatterns = [
    path('sgxra/', RemotelyAttestSGXEnclave.as_view(), name="SGX-RA"),
]

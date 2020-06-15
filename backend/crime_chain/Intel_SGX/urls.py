"""
URLs to access djangos APIs
"""


from django.urls import path, include
from rest_framework import routers
from .views import SGXView

router = routers.DefaultRouter()
router.register('sgxra', SGXView)

urlpatterns = [
    path('', include(router.urls))
]

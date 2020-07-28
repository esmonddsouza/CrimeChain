from rest_framework.response import Response
from rest_framework import generics
from rest_framework import viewsets
from django.shortcuts import render
from .serializers import EventLogSerializer
from .models import EventLogData
from rest_framework.decorators import api_view
from rest_framework.views import APIView

class EventLogView(APIView):
    def post(self, request):
        queryset = EventLogData.objects.all()
        serializer_class = EventLogSerializer
        event_log_serializer = EventLogSerializer(data=request.data)
        if event_log_serializer.is_valid():
            event_log_serializer.save()
            return Response(event_log_serializer.data, status=200) 
        return Response(event_log_serializer.errors, status=400)
from rest_framework import serializers
from .models import EventLogData

class EventLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLogData
        fields = ('userId', 'accountId', 'assigningAccountId', 'ipfsHash', 'dateTime', 'policeStationId', 'action')
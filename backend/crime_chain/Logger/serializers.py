from rest_framework import serializers
from .models import EventLogData, RoleAssignmentLogData

class EventLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventLogData
        fields = ('userId', 'accountId', 'assigningAccountId', 'ipfsHash', 'dateTime', 'policeStationId', 'action')

class RoleAssignmentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleAssignmentLogData
        fields = ('userId', 'adminAccountId', 'linkedAccountId', 'role', 'dateTime', 'policeStationId', 'action')
from django.db import models

class EventLogData(models.Model):
    """Event Logs Model"""
    userId = models.CharField(max_length=256)
    accountId = models.CharField(max_length=256)
    assigningAccountId = models.CharField(max_length=256)
    ipfsHash = models.CharField(max_length=256)
    dateTime = models.DateTimeField(auto_now_add=True)
    policeStationId = models.CharField(max_length=256)
    action = models.CharField(max_length=1, default="E")
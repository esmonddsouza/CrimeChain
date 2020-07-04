from rest_framework import serializers
from .models import SGXData, RemoteAttestationData

class SGXSerializer(serializers.ModelSerializer):
    class Meta:
        model = SGXData
        fields = ('verified', 'data', 'msg0', 'msg1', 'msg2', 'msg3', 'msg4')


class SGXRASerializer(serializers.ModelSerializer):
    class Meta:
        model = RemoteAttestationData
        fields = ('verified', 'data')
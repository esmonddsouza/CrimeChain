from rest_framework import serializers
from .models import SGXData

class SGXSerializer(serializers.ModelSerializer)
    class SGX:
        model = SGXData
        fields = ("verified", "secretKey", "msg0", "msg1", "msg2", "msg3", "msg4")
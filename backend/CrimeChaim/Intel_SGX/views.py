from django.shortcuts import render
from rest_framework.response import Response
from .serializers import BusAPIDataSerializer
from .models import SGXData
from SGX_Remote_Attestation.remote_node import 


class RemotelyAttestSGXEnclave():
    """
    Returns SGX Remote Attestaion Details along with the secret key
    """
    def list(self, request):
        ver, key, msg0, msg1, msg2, msg3, msg4 = remoteAttestaion()
        sgxModel = SGXData(verified=ver, secretKey=key, msg0=msg0, msg1=msg1, msg2=msg2, msg3=msg3, msg4=msg4)
        json_content = self.SGXSerializer(sgxModel, many=False)
        return Response(json_content.data, status=200)
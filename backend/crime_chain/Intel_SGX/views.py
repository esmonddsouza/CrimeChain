from rest_framework.response import Response
from rest_framework import generics
from rest_framework import viewsets
from .SGX_Remote_Attestation.remote_node import remoteAttestation
from rest_framework.decorators import api_view
from rest_framework.views import APIView

class SGXRAView(APIView):
    def post(self, request):
        encrypt = request.data["encrypt"]
        if encrypt:
            data = request.data["data"]["data"]
        else:
            data = request.data["data"]
        iv = request.data["iv"]
        ver, data, iv = remoteAttestation(str(data), int(iv), encrypt)
        buffer_data = {'type': 'Buffer', 'data': data}
        response = Response({'data': buffer_data, 'verified': ver, 'iv': str(iv)}, status=200)
        return response
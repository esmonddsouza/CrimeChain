from rest_framework.response import Response
from rest_framework import generics
from rest_framework import viewsets
from .serializers import SGXSerializer
from .models import SGXData
from .SGX_Remote_Attestation.remote_node import remoteAttestation


class SGXView(viewsets.ModelViewSet):
    queryset = SGXData.objects.all()
    serializer_class = SGXSerializer
    def list(self, request):
        data = request.data
        ver, key, msg0, msg1, msg2, msg3, msg4 = remoteAttestation(data)
        sgxModel = SGXData(verified=ver, secretKey=key, msg0=msg0, msg1=msg1, msg2=msg2, msg3=msg3, msg4=msg4)
        json_content = self.serializer_class(sgxModel, many=False)
        return Response(json_content.data, status=200)
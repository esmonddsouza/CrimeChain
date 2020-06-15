from django.db import models

# Create your models here.
class SGXData(models.Model):
    """Intel SGX Verification Data"""
    verified = models.BooleanField(default=False)
    secretKey = models.CharField(max_length=256, null=True)
    msg0 = models.CharField(max_length=256, null=True)
    msg1 = models.CharField(max_length=256, null=True)
    msg2 = models.CharField(max_length=256, null=True)
    msg3 = models.CharField(max_length=256, null=True)
    msg4 = models.CharField(max_length=256, null=True)

    

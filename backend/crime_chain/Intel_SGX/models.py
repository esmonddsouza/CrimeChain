from django.db import models

# Create your models here.
class SGXData(models.Model):
    """Intel SGX Verification Data"""
    verified = models.BooleanField(default=False)
    secretKey = models.CharField(max_length=256)
    msg0 = models.CharField(max_length=256)
    msg1 = models.CharField(max_length=256)
    msg2 = models.CharField(max_length=256)
    msg3 = models.CharField(max_length=256)
    msg4 = models.CharField(max_length=256)

    

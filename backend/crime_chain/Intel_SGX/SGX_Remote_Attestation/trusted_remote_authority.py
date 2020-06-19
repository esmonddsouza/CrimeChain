from random import random
import secrets
from .intel_attestation_service import IntelAttestationService

class TrustedRemoteAuthority:
    public_key = '5EQAipNN_RTxXDOkEbkK4'
    sp_id = 'dbcmtGMJsCzJUy9f0q3J'
    client_gid = ''
    dhke_context = ''


    def generate_nonce(length):
        """Generate pseudorandom number."""
        return secrets.token_urlsafe(length)


    def request_service(key):
        if TrustedRemoteAuthority.public_key == key:
            nonce = TrustedRemoteAuthority.generate_nonce(40)
            return True, nonce
        else:
            return False, ''


    def verify_gid(GID):
        global client_gid
        client_gid = GID
        if GID == '12345678900987654321':
            return True
        else:
            return False


    def verify_msg1(msg1):
        # Step 4: The TRA verifies details from the previous msg (msg1), creates its DHKE context, DHKE secret key
        #  fetches the SigRL from the IAS, combines it together and sends it as msg2
        dhke_key = TrustedRemoteAuthority.sgx_ra_get_gb()
        TrustedRemoteAuthority.sgx_create_dhke_context()
        sigRL = IntelAttestationService.generate_sigRL(client_gid)
        msg2 = sigRL + TrustedRemoteAuthority.sp_id + dhke_key
        return msg2


    def sgx_create_dhke_context():
        dhke_context = secrets.token_urlsafe(40)


    def sgx_ra_get_gb():
        # Returns client side DHKE secret
        return secrets.token_urlsafe(40)


    def verify_quote(quote):
        verified = IntelAttestationService.verify_quote(quote)
        if verified:
            secret_key = TrustedRemoteAuthority.Enclave.get_secret_key()
            return str(verified)+secrets.token_urlsafe(40), secret_key
        else:
            return verified, ''


    class Enclave:

        def get_secret_key():
            return 'ipZqWnISXYgZGO8Lz1r3hOXXjnntMC14YxGsmHkNZ5lPQECb3J7JSg'
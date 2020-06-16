import secrets

class IntelAttestationService:

    sigRL = ''

    def generate_sigRL(GID):
        IntelAttestationService.sigRL = secrets.token_urlsafe(40)
        return IntelAttestationService.sigRL


    def verify_quote(quote):
        return True
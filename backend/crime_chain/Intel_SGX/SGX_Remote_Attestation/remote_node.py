from .trusted_remote_authority import TrustedRemoteAuthority
import secrets
import pyaes, pbkdf2, binascii, os, secrets
import ast
import zlib



def remoteAttestation(data, iv, encrypt):
    print('OG Data-->', data)
    verified, msg0, msg1, msg2, msg3, msg4 = get_secret_key()
    if encrypt:
        b = bytes(data, 'utf-8')
        data = zlib.compress(b, 4)
        print('Compressed data-->', data)
        encrypted_data, iv = Enclave.encrypt_data(data)
        print('Encrypted Data-->', encrypted_data)
        return verified, encrypted_data, iv
    else: 
        decrypted_data = Enclave.decrypt_data(binascii.unhexlify(data), iv)
        print('Decrypted Data-->', decrypted_data)
        decompressed_decrypted_data = zlib.decompress(decrypted_data)
        print('Decompressed Data-->', decompressed_decrypted_data)
        return verified, ast.literal_eval(decompressed_decrypted_data.decode("utf-8")), iv




public_key = ''
tra_public_key = '5EQAipNN_RTxXDOkEbkK4'
dhke_key = ''
dhke_context = ''
group_id = '12345678900987654321'


def get_secret_key():
    # Step 1: The RN requests for secrete key by providing the public key of the TRA
    verified, nonce = TrustedRemoteAuthority.request_service(tra_public_key)
    if verified:
        msg0, msg1, msg2, msg3, msg4 = initialize_remote_attestation(nonce)
    return verified, msg0, msg1, msg2, msg3, msg4



def initialize_remote_attestation(nonce):
    initialised, dkhe = Enclave.sgx_ra_init()
    if initialised:
        print('Initialised')
        # Step 2: Generate DHKE Context for further use, Generate Group Id to be sent to the TRA
        sgx_create_dhke_context()
        GID = sgx_get_extended_epid_group_id()
        if GID is not None:
            msg0 = GID
        gidVerified = TrustedRemoteAuthority.verify_gid(GID)
        if gidVerified:
            # Step 3: The client generates a temporal key, the DHKE context and its public DHKE key to be sent to the TRA
            msg1 = sgx_ra_get_msg1()
            print('Msg1 ', msg1)
            msg2 = TrustedRemoteAuthority.verify_msg1(msg1)
            print('Msg2 ', msg2)
            # Step 5: The remote node generates a quote report via its quoting
            msg3 = sgx_ra_proc_msg2(msg2)
            print('Msg3 ', msg3)
            msg4, secret_key = TrustedRemoteAuthority.verify_quote(msg3)
            Enclave.secret_key = secret_key
            print('Msg4 ', msg4)
    return msg0, msg1, msg2, msg3, msg4


def sgx_get_extended_epid_group_id():
    return group_id


def sgx_create_dhke_context():
    global dhke_context
    dhke_context = secrets.token_urlsafe(40)


def sgx_ra_get_msg1():
    ephemeral_key = generate_ephemeral_public_key(20)
    dhke_key = sgx_ra_get_ga()
    message = dhke_key + dhke_context + ephemeral_key
    return message


def sgx_ra_get_ga():
    # Returns client side DHKE secret
    return secrets.token_urlsafe(40)


def generate_ephemeral_public_key(length):
    return secrets.token_urlsafe(length)


def sgx_ra_proc_msg2_trusted(msg2):
    secret = secrets.token_urlsafe(20)
    return secret + msg2


def sgx_ra_proc_msg2(msg2):
    proc_msg2 = sgx_ra_proc_msg2_trusted(msg2)
    quote = Quote.sgx_ra_get_msg3_trusted(proc_msg2, msg2)
    msg3 = quote + dhke_context
    return msg3


class Enclave:

    secret_key = ''

    def sgx_ra_init():
        return True, dhke_key

    def encrypt_data(plaintext):
        print('AES encryption key:', Enclave.secret_key)
        iv = secrets.randbits(256)
        aes = pyaes.AESModeOfOperationCTR(Enclave.secret_key, pyaes.Counter(iv))
        ciphertext = aes.encrypt(plaintext)
        #print('Encrypted:', binascii.hexlify(ciphertext))
        return binascii.hexlify(ciphertext), iv


    def decrypt_data(ciphertext, iv):
        aes = pyaes.AESModeOfOperationCTR(Enclave.secret_key, pyaes.Counter(iv))
        plaintext = aes.decrypt(ciphertext)
        #print('Decrypted:', plaintext.decode("utf-8"))
        return plaintext


class Quote:
    def sgx_ra_get_msg3_trusted(proc_msg2, msg2):
        return secrets.token_urlsafe(40)


verified, encrypted_data, iv = remoteAttestation('[45, 46]', '', True)
verified, decompressed_decrypted_data, iv = remoteAttestation(encrypted_data, iv, False)
print('Final Data', decompressed_decrypted_data)
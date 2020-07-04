import pyaes, pbkdf2, binascii, os, secrets


secret_key = b'\xe7gz\xd9\x1b\x125\xf5@p\xad\x9bcW\xdc\x0e.\x87Z=\xdc5\xd3\x84\xb8\x95\xf3\x13\xc3S\xf1\xac'

def encrypt_data(plaintext):
    print('AES encryption key:', secret_key)
    iv = secrets.randbits(256)
    aes = pyaes.AESModeOfOperationCTR(secret_key, pyaes.Counter(iv))
    ciphertext = aes.encrypt(plaintext)
    print('Encrypted:', binascii.hexlify(ciphertext))
    return ciphertext, iv


def decrypt_data(ciphertext, iv):
    aes = pyaes.AESModeOfOperationCTR(secret_key, pyaes.Counter(iv))
    plaintext = aes.decrypt(ciphertext)
    print('Decrypted:', plaintext.decode("utf-8"))
    return plaintext


ciphertext, iv = encrypt_data("Esmond")

decrypt_data(ciphertext, iv)
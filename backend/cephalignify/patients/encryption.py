from cryptography.fernet import Fernet
from django.conf import settings

fernet = Fernet(settings.ENCRYPTION_KEY)

def encrypt_text(plain_text):
    return fernet.encrypt(plain_text.encode()).decode()

def decrypt_text(encrypted_text):
    return fernet.decrypt(encrypted_text.encode()).decode()

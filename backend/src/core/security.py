from passlib.context import CryptContext


pwd_encrypter = CryptContext(schemes=['bcrypt'], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_encrypter.hash(password)

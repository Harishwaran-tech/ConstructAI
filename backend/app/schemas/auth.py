from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.user import UserOut

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str

class GenericResponse(BaseModel):
    message: str

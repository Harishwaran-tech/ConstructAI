from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_password_reset_token,
    verify_token
)
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    GenericResponse
)

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role=user_in.role or "Homeowner",
        company_name=user_in.company_name,
        phone_number=user_in.phone_number,
        avatar_url=user_in.avatar_url
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )

from app.models.admin import AuditLog

@router.post("/login", response_model=TokenResponse)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    email_clean = login_in.email.lower().strip()
    if email_clean == "superadmin":
        email_clean = "superadmin@constructai.com"

    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account."
        )

    # Record login audit entry
    try:
        audit = AuditLog(
            user_id=user.id,
            user_email=user.email,
            action=f"{user.role} Login",
            category="Security",
            details=f"Successful JWT session created for {user.full_name} ({user.email})"
        )
        db.add(audit)
        db.commit()
    except Exception:
        pass

    access_token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        # Avoid user enumeration in production, but return standard response
        return ForgotPasswordResponse(
            message="If an account exists with this email, a password reset token has been generated.",
            reset_token=None
        )
    
    reset_token = create_password_reset_token(email=user.email)
    return ForgotPasswordResponse(
        message="Password reset token generated successfully. You can now reset your password.",
        reset_token=reset_token
    )

@router.post("/reset-password", response_model=GenericResponse)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_token(req.reset_token, token_type="reset")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )
    
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()

    return GenericResponse(message="Password reset successfully. You can now log in with your new password.")

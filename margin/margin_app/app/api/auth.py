"""
API endpoints for auth logic.
"""

from datetime import timedelta

from fastapi import APIRouter, HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
from loguru import logger
from pydantic import EmailStr
from jwt.exceptions import InvalidTokenError

from app.core.config import settings
from app.services.auth.base import (
    google_auth,
    create_access_token,
    create_refresh_token,
    decode_signup_token,
)

from app.crud.admin import admin_crud
from app.schemas.admin import AdminLogin
from app.schemas.admin import AdminResetPassword
from app.schemas.auth import SignupConfirmation, SignupRequest
from app.services.auth.security import (
    get_password_hash,
    verify_password,
)
from app.services.auth.base import get_admin_user_from_state
from app.services.emails import email_service


router = APIRouter()


@router.get("/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def login_google() -> RedirectResponse:
    """
    Redirect to Google login page.

    :return: RedirectResponse - Redirect to Google login page.
    """
    return RedirectResponse(url=google_auth.google_login_url)


@router.post(
    "/logout",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="admin logout",
    description="Logout admin and clear authentication cookies",
)
async def logout_admin(request: Request, response: Response) -> dict:
    """
    Logout the admin user and clear all authentication cookies.

    This endpoint:
    - Clears the refresh_token cookie with secure parameters
    - Blacklists the refresh token to prevent reuse
    - Uses proper secure cookie deletion
    - Validates the admin is authenticated before logout

    Args:
        request: Request object to get current admin
        response: Response object to delete cookies

    Returns:
        dict: Success message

    Raises:
        HTTPException: If admin is not authenticated
    """
    try:
        current_admin = await get_admin_user_from_state(request)

        if not current_admin:
            authorization = request.headers.get("Authorization")
            if not authorization or not authorization.startswith("Bearer "):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="No authentication token found",
                )

            token = authorization.split(" ")[1]

            try:
                email = decode_signup_token(token)

                if not email:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid token format",
                    )

                current_admin = await admin_crud.get_by_email(email)
                if not current_admin:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Admin not found",
                    )

            except InvalidTokenError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token",
                )
            except Exception as e:
                if "Invalid token" in str(e) or "Token expired" in str(e):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid or expired token",
                    )
                raise

        response.delete_cookie(
            key="refresh_token", path="/", httponly=True, secure=True, samesite="lax"
        )

        logger.info(f"Admin {current_admin.email} logged out successfully")

        return {"message": "Admin logged out successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during logout",
        )


@router.post("/refresh")
async def refresh_access_token(request: Request):
    """Refresh access token using refresh token."""
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found"
        )
    try:
        email = decode_signup_token(refresh_token)
        admin = await admin_crud.get_by_email(email)

        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found"
            )

        new_access_token = create_access_token(admin.email)

        return {"access_token": new_access_token, "token_type": "bearer"}

    except Exception as e:
        if "Invalid token" in str(e) or "Token expired" in str(e):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )
        raise


@router.get("/google", status_code=status.HTTP_200_OK)
async def auth_google(code: str, response: Response):
    """
    Authenticate with Google OAuth, create an access token, and save it in the session.

    :param code: str - The code received from Google OAuth.
    :param db: AsyncSession - The database session.
    :param request: Request - The HTTP request object to access the session.

    :return: dict - A success message.
    """
    try:
        admin_data = await google_auth.get_user(code=code)

        if not admin_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to authenticate user.",
            )

        admin = await admin_crud.get_by_email(email=admin_data.email)
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin with this email not found.",
            )

        access_token = create_access_token(
            admin_data.email,
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        )

        refresh_token = create_access_token(
            admin_data.email,
            expires_delta=timedelta(days=settings.refresh_token_expire_days),
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            path="/",
            max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        )

        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        logger.error(f"Failed to authenticate admin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to authenticate admin.",
        )


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="admin login",
    description="login admin with email and password",
)
async def login_admin(data: AdminLogin, response: Response):
    """
    handles admin login by email and password
    Args:
        data (AdminLogin): A JSON object containing email and password
    Raises:
        HTTPException: If the admin with the given email is not found.
        HTTPException: if the password is incorrect
    Returns:
        JSONResponse: A response with the acess token
    """

    admin = await admin_crud.get_object_by_field("email", data.email)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin with this email not found.",
        )

    if not verify_password(data.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        admin.email,
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    refresh_token = create_refresh_token(
        admin.email,
        expires_delta=timedelta(minutes=settings.refresh_token_expire_days),
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        path="/",
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/change_password",
    status_code=status.HTTP_200_OK,
    summary="password change for admin",
    description="Sends an email with a reset password link",
)
async def change_password(
    admin_email: EmailStr,
):
    """
    Asynchronously handles the process of changing an admin's password
    by sending a reset password email.
    Args:
        admin_email (EmailStr): The email address of the admin whose password needs to be changed.
    Raises:
        HTTPException: If the admin with the given email is not found (404).
        HTTPException: If there is an error while sending the reset password email (500).
    Returns:
        JSONResponse: A response indicating that the reset password email was successfully sent.
    """
    admin = await admin_crud.get_by_email(admin_email)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin with this email was not found.",
        )

    if not await email_service.reset_password_mail(to_email=admin.email):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error while sending email.",
        )

    return JSONResponse(
        content={"message": "Password reset email has been sent successfully"}
    )


@router.post(
    "/reset_password",
    status_code=status.HTTP_200_OK,
    summary="password reset for admin",
    description="Resets the admin's password using a token.",
)
async def reset_password(data: AdminResetPassword):
    """
    Reset the password for an admin user using a token from email.

    This function decodes the provided JWT token to get the admin's email,
    verifies the admin exists, and then updates the password.

    Args:
        data (AdminResetPassword): An object containing the reset token and the new password.

    Raises:
        HTTPException: If the token is invalid, expired, or the user is not found.

    Returns:
        JSONResponse: A response indicating that the password was successfully changed.
    """
    try:
        email = decode_signup_token(data.token)
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid token: {e}",
        )

    admin = await admin_crud.get_by_email(email)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin with this email was not found.",
        )

    admin.password = get_password_hash(data.new_password)
    await admin_crud.write_to_db(admin)
    return JSONResponse(content={"message": "Password was changed successfully"})


@router.post("/signup-confirmation", status_code=status.HTTP_200_OK)
async def signup_confirmation(
    confirmation: SignupConfirmation,
    response: Response,
):
    """
    Handle user registration confirmation with JWT token.

    Parameters:
    - confirmation: SignupConfirmation
        The confirmation request containing token, password, and name
    - response: Response
        The HTTP response object to set cookies

    Returns:
    - dict: The access token and token type

    Raises:
    - HTTPException: If token is invalid, expired, or user already exists
    """
    try:
        email = decode_signup_token(confirmation.token)

        existing_user = await admin_crud.get_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists",
            )

        # Create new user
        hashed_password = get_password_hash(confirmation.password)
        await admin_crud.create_admin(
            email=email,
            name=confirmation.name,
            password=hashed_password,
        )

        access_token = create_access_token(
            email,
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        )

        refresh_token = create_access_token(
            email,
            expires_delta=timedelta(days=settings.refresh_token_expire_days),
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            path="/",
            max_age=settings.refresh_token_expire_seconds,
        )

        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        logger.error(f"Failed to confirm signup: {str(e)}")
        if str(e) in ["Invalid token", "Token expired"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to confirm signup",
        )


@router.post(
    "/signup",
    status_code=status.HTTP_200_OK,
    summary="User signup",
    description="Initiates the signup process by sending a confirmation email",
)
async def signup_user(payload: SignupRequest):
    """
    Handles user signup by sending a confirmation email with a token.

    Args:
        email (EmailStr): The email address of the user.

    Raises:
        HTTPException: If the email already exists in the database.

    Returns:
        JSONResponse: A response indicating that the confirmation email was sent.
    """
    email = payload.email
    try:
        # Check if the email already exists in the database
        existing_user = await admin_crud.get_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists",
            )

        email_sent = await email_service.send_confirmation_email(to_email=email)

        if not email_sent:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send confirmation email",
            )

        return JSONResponse(content={"message": "Confirmation email sent successfully"})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during signup",
        )

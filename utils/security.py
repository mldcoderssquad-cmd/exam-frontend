import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )
    return hashed.decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def create_token(user_id: str, role: str) -> str:
    secret = os.getenv("JWT_SECRET")

    if not secret:
        raise RuntimeError("JWT_SECRET is not configured")

    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8)
    }

    return jwt.encode(
        payload,
        secret,
        algorithm="HS256"
    )


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token.

    Returns:
        dict: JWT payload

    Raises:
        ValueError: If token is missing, invalid, expired,
                    or JWT_SECRET is not configured.
    """

    secret = os.getenv("JWT_SECRET")

    if not secret:
        raise ValueError("JWT_SECRET is not configured")

    if not token:
        raise ValueError("Token is required")

    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")

    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
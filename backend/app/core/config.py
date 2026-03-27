import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # OpenAI
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4-turbo"
    MAX_CV_TOKENS: int = 3000
    MAX_JOB_TOKENS: int = 3000
    ALLOWED_EXTENSIONS: tuple = (".pdf", ".docx")
    CORS_ORIGINS: list = ["http://localhost:5173"]

    # Database
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/hrhero"
    )
    DEBUG: bool = os.environ.get("DEBUG", "true").lower() == "true"

    # JWT
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY", "change-me-in-production-use-random-256bit-key")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24h

    # Frontend
    FRONTEND_URL: str = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    # Stripe
    STRIPE_SECRET_KEY: str = os.environ.get("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_PRICE_PRO: str = os.environ.get("STRIPE_PRICE_PRO", "")
    STRIPE_PRICE_BUSINESS: str = os.environ.get("STRIPE_PRICE_BUSINESS", "")

    # Email (SMTP)
    MAIL_USERNAME: str = os.environ.get("MAIL_USERNAME", "")
    MAIL_PASSWORD: str = os.environ.get("MAIL_PASSWORD", "")
    MAIL_FROM: str = os.environ.get("MAIL_FROM", "noreply@hrhero.com")
    MAIL_PORT: int = int(os.environ.get("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_FROM_NAME: str = "HR Hero"


settings = Settings()

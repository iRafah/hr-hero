import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4-turbo"
    MAX_CV_TOKENS: int = 3000
    MAX_JOB_TOKENS: int = 3000
    ALLOWED_EXTENSIONS: tuple = (".pdf", ".docx")
    CORS_ORIGINS: list = ["http://localhost:5173"]


settings = Settings()

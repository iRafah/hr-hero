from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.core.config import settings

_mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

_fastmail = FastMail(_mail_config)

async def send_verification_email(email: str, full_name: str, token: str) -> None:
    verification_url = f"{settings.FRONTEND_URL}/verificar-email?token={token}"

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #3b82f6; margin-bottom: 8px;">HR Hero</h2>
        <h3 style="margin-top: 0;">Confirme seu email</h3>
        <p>Olá, <strong>{full_name}</strong>!</p>
        <p>Obrigado por se registrar no HR Hero. Clique no botão abaixo para confirmar seu email:</p>
        <a href="{verification_url}"
           style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #3b82f6; color: #fff;
                  border-radius: 8px; text-decoration: none; font-weight: bold;">
            Confirmar Email
        </a>
        <p style="color: #94a3b8; font-size: 13px;">
            Se você não criou uma conta no HR Hero, ignore este email.
        </p>
        <p style="color: #94a3b8; font-size: 12px;">
            Ou copie e cole este link no seu navegador:<br>
            <a href="{verification_url}" style="color: #3b82f6;">{verification_url}</a>
        </p>
    </div>
    """

    message = MessageSchema(
        subject="HR Hero – Confirme seu email",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )

    await _fastmail.send_message(message)

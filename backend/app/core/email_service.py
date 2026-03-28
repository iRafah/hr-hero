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


async def send_payment_success_email(email: str, full_name: str, plan: str) -> None:
    plan_display = plan.capitalize()
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #3b82f6; margin-bottom: 8px;">HR Hero</h2>
        <h3 style="margin-top: 0;">Pagamento confirmado ✓</h3>
        <p>Olá, <strong>{full_name}</strong>!</p>
        <p>Seu pagamento foi processado com sucesso. Você agora tem acesso completo ao plano <strong>{plan_display}</strong>.</p>
        <div style="margin: 24px 0; padding: 16px; background: #1e293b; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">Plano ativo: <strong style="color: #f1f5f9;">{plan_display}</strong></p>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">Obrigado por usar o HR Hero!</p>
    </div>
    """
    message = MessageSchema(
        subject=f"HR Hero – Pagamento confirmado · Plano {plan_display}",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    await _fastmail.send_message(message)


async def send_payment_failed_email(email: str, full_name: str) -> None:
    portal_url = f"{settings.FRONTEND_URL}/account/subscription"
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #3b82f6; margin-bottom: 8px;">HR Hero</h2>
        <h3 style="margin-top: 0; color: #ef4444;">Falha no pagamento</h3>
        <p>Olá, <strong>{full_name}</strong>!</p>
        <p>Não conseguimos processar o pagamento da sua assinatura. Por favor, atualize seus dados de cobrança para manter o acesso.</p>
        <a href="{portal_url}"
           style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #ef4444; color: #fff;
                  border-radius: 8px; text-decoration: none; font-weight: bold;">
            Atualizar dados de pagamento
        </a>
        <p style="color: #94a3b8; font-size: 13px;">Se precisar de ajuda, entre em contato com nosso suporte.</p>
    </div>
    """
    message = MessageSchema(
        subject="HR Hero – Ação necessária: falha no pagamento",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    await _fastmail.send_message(message)


async def send_cancellation_email(email: str, full_name: str, period_end: str) -> None:
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #3b82f6; margin-bottom: 8px;">HR Hero</h2>
        <h3 style="margin-top: 0;">Assinatura cancelada</h3>
        <p>Olá, <strong>{full_name}</strong>!</p>
        <p>Sua assinatura foi cancelada conforme solicitado. Você continuará com acesso completo até:</p>
        <div style="margin: 24px 0; padding: 16px; background: #1e293b; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #f1f5f9;">{period_end}</p>
        </div>
        <p>Após essa data, sua conta voltará ao plano gratuito. Você pode reativar sua assinatura a qualquer momento.</p>
        <p style="color: #94a3b8; font-size: 13px;">Sentiremos sua falta. Obrigado por ter usado o HR Hero!</p>
    </div>
    """
    message = MessageSchema(
        subject="HR Hero – Confirmação de cancelamento",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    await _fastmail.send_message(message)


async def send_plan_changed_email(email: str, full_name: str, old_plan: str, new_plan: str) -> None:
    old_display = old_plan.capitalize()
    new_display = new_plan.capitalize()
    action = "atualizado para" if old_plan < new_plan else "alterado para"
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
        <h2 style="color: #3b82f6; margin-bottom: 8px;">HR Hero</h2>
        <h3 style="margin-top: 0;">Plano {action} {new_display}</h3>
        <p>Olá, <strong>{full_name}</strong>!</p>
        <p>Seu plano foi alterado com sucesso:</p>
        <div style="margin: 24px 0; padding: 16px; background: #1e293b; border-radius: 8px; display: flex; gap: 12px; align-items: center;">
            <span style="color: #94a3b8;">{old_display}</span>
            <span style="color: #3b82f6; font-size: 18px;">→</span>
            <strong style="color: #f1f5f9;">{new_display}</strong>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">As alterações já estão em efeito. Obrigado por usar o HR Hero!</p>
    </div>
    """
    message = MessageSchema(
        subject=f"HR Hero – Plano {action} {new_display}",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    await _fastmail.send_message(message)

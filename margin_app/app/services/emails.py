"""Email service implementation using SendGrid."""

from typing import Optional, Dict, Any
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, TemplateId
from app.core.config import settings
from app.services.auth import create_access_token, get_expire_time
import logging

logger = logging.getLogger("EmailService")


class EmailService:
    """SendGrid email operations."""

    def __init__(self) -> None:
        self.client = SendGridAPIClient(settings.sendgrid_api_key)
        self.sender = Email(
            email=settings.email_sender, name=settings.email_sender_name
        )

    async def send_email(
        self,
        to_email: str | list[str],
        subject: str,
        content: str,
        is_html: bool = False,
        template_id: Optional[str] = None,
        template_data: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Send email through SendGrid."""
        try:
            to_emails = [to_email] if isinstance(to_email, str) else to_email

            message = Mail(
                from_email=self.sender,
                to_emails=[To(email=email) for email in to_emails],
                subject=subject,
            )

            if template_id:
                message.template_id = TemplateId(template_id)
                if template_data:
                    message.dynamic_template_data = template_data
            else:
                content_type = "text/html" if is_html else "text/plain"
                message.content = [Content(content_type, content)]

            if settings.email_test_mode:
                logger.info(
                    f"Test mode: Would send email:\n"
                    f"To: {to_emails}\n"
                    f"Subject: {subject}\n"
                    f"Content: {content[:100]}..."
                )
                return True

            response = self.client.send(message)
            logger.info(f"Email sent successfully to {to_emails}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            raise

    async def reset_password_mail(self, to_email: str):
        """
        Sends a password reset email to the specified recipient.
        This method generates a password reset token for the given email address
        and sends an email containing a link to reset the password.
        Args:
            to_email (str): The recipient's email address.
        Returns:
            Coroutine: A coroutine that sends the email asynchronously.
        """
        token = create_access_token(
            email=to_email,
            expires_delta=get_expire_time(
                settings.reset_password_expire_minutes),
        )
        return await self.send_email(
            to_email=to_email,
            subject="Reset your password",
            content=f"{settings.host}/{settings.forget_password_url}/{token}",
        )


email_service = EmailService()

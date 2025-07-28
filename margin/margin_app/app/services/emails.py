"""
Email service implementation using SendGrid.

This module provides email functionality for the application, including
password reset emails with token generation and MJML template rendering.
"""

from typing import Optional, Dict, Any
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, TemplateId
from app.core.config import settings
from app.services.auth.base import (
    create_reset_password_token,
    create_access_token,
)
from mjml import mjml_to_html  # Changed import to use specific function
from jinja2 import Environment, FileSystemLoader, select_autoescape
import logging
import os

logger = logging.getLogger("EmailService")


TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "mail", "email-templates")
jinja_env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR), autoescape=select_autoescape(["mjml"])
)


class EmailService:
    """SendGrid email operations."""

    def __init__(self) -> None:
        self.client = SendGridAPIClient(settings.sendgrid_api_key)
        self.sender = Email(
            email=settings.email_sender, name=settings.email_sender_name
        )

    def render_mjml_template(self, template_name: str, context: dict) -> str:
        """
        Render an MJML template with Jinja2 and convert it to HTML.
        """
        template = jinja_env.get_template(template_name)
        mjml_content = template.render(context)
        html_result = mjml_to_html(mjml_content) # changed to use explicit function
        return html_result["html"]

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

    async def reset_password_mail(self, to_email: str, username: str = None):
        """
        Sends a password reset email to the specified recipient.

        This method generates a secure password reset token for the given email address
        and sends an email containing a link to reset the password. The token has a
        limited expiration time for security purposes.

        Args:
            to_email: The recipient's email address.
            username: Optional username for personalization in the email.

        Returns:
            bool: True if email was sent successfully, False otherwise.
        """
        token = await create_reset_password_token(to_email)

        reset_link = f"{settings.host}/{settings.forget_password_url}/{token}"
        html_content = self.render_mjml_template(
            "reset_password.mjml", {"username": username, "reset_link": reset_link}
        )
        return await self.send_email(
            to_email=to_email,
            subject="Reset your password",
            content=html_content,
            is_html=True,
        )

    async def send_confirmation_email(self, to_email: str):
        """
        Sends a signup confirmation email to the specified recipient.

        This method generates a signup confirmation token for the given email address
        and sends an email containing a link to confirm the signup. The token has a
        limited expiration time for security purposes.

        Args:
            to_email: The recipient's email address.
            username: Optional username for personalization in the email.

        Returns:
            bool: True if email was sent successfully, False otherwise.
        """
        token = create_access_token(to_email)
        confirmation_link = f"{settings.app_base_url}/signup-confirmation?token={token}"
        html_content = self.render_mjml_template(
            "signup_confirmation.mjml",
            {"link": confirmation_link},
        )
        return await self.send_email(
            to_email=to_email,
            subject="Confirm your signup",
            content=html_content,
            is_html=True,
        )


email_service = EmailService()

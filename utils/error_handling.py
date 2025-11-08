import logging
import time
import smtplib
from email.mime.text import MIMEText
from typing import Callable

# -----------------------------
# Logging Configuration
# -----------------------------
logging.basicConfig(
    filename='app.log',
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# -----------------------------
# Retry Decorator
# -----------------------------
def retry_operation(retries=3, delay=2):
    """Decorator to retry a function if it raises an exception."""
    def decorator(func: Callable):
        def wrapper(*args, **kwargs):
            for attempt in range(1, retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logging.error(f"Attempt {attempt} failed: {e}")
                    time.sleep(delay)
            logging.error(f"All {retries} retries failed for {func.__name__}")
            raise
        return wrapper
    return decorator

# -----------------------------
# Alerting Function
# -----------------------------
def send_email_alert(subject: str, body: str, recipient: str):
    try:
        sender = "your-email@example.com"
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = recipient

        with smtplib.SMTP("smtp.example.com", 587) as server:
            server.starttls()
            server.login(sender, "your-email-password")
            server.sendmail(sender, recipient, msg.as_string())

        logging.info(f"Alert sent to {recipient}")

    except Exception as e:
        logging.error(f"Failed to send alert: {e}")

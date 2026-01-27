import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class BaseModel(models.Model):
    """
    The Enterprise Base Model.
    Adds a UUID and timestamps to every table that inherits from it.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class User(AbstractUser, BaseModel):
    """
    Custom User Model.
    Uses Email as the primary login identifier.
    """
    email = models.EmailField(unique=True)
    is_onboarded = models.BooleanField(default=False)

    avatar_url = models.URLField(max_length=500, blank=True, null=True)

    # Enterprise config: Login with Email, not Username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # Required by Django logic, but we can auto-fill it.

    def __str__(self):
        return self.email
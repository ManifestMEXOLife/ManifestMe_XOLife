from django.db import models
from django.conf import settings
from core.models import BaseModel

# Create your models here.

class Video(BaseModel):
    """
    The "Foreign Key" creates the link
    related_name="videos" allows us to access all videos of a user via user.videos.all()
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="videos"
    )

    title = models.CharField(max_length=255)

    # We store the external URL (S3)
    video_url = models.URLField(max_length=500)
    thumbnail_url = models.URLField(max_length=500, blank=True, null=True)

    # Track processing status
    status = models.CharField(
        max_length=20,
        choices=[
            ('processing', 'Processing'),
            ('ready', 'Ready'),
            ('failed', 'Failed')
        ],
        default='processing'
    )

    def __str__(self):
        return f"{self.user.email} - {self.title}"
from ninja import Schema
from uuid import UUID
from datetime import datetime
from typing import Optional

class VideoOutSchema(Schema):
    id: UUID
    title: str
    video_url: str
    thumbnail_url: Optional[str]
    status: str
    created_at: datetime

class VideoCreateSchema(Schema):
    title: str
    video_url: str

class VideoUpdateSchema(Schema):
    title: str
    video_url: str
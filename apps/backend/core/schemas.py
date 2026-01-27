from ninja import Schema
from typing import Optional
from uuid import UUID

class UserOutSchema(Schema):
    id: UUID
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    avatar_url: Optional[str]
    is_onboarded: bool

class UserUpdateSchema(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
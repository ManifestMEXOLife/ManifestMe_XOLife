from ninja import NinjaAPI

from .schemas import UserOutSchema, UserUpdateSchema
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from videos.api import router as videos_router

# This is the main API instance for the backend application
# standard_response = True (optional): Ensures all responses follow a standard format
api = NinjaAPI(
    title="ManifestMe Enterprise Backend API",
    version="0.1.0",
    description="API for ManifestMe Enterprise Backend"
)

# We will import and attach other controllers here later
# for now, just adding a health check

@api.get("/health")
def health_check(request):
    return {"status": "operational", "db": "connected"}

@api.get("/me", response=UserOutSchema)
def get_me(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.first()

User = get_user_model()

@api.patch("/me", response=UserOutSchema)
def update_profile(request, payload: UserUpdateSchema):
    user = User.objects.first()

    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(user, attr, value)

    user.save()

    return user

# Include the videos router under /videos path
api.add_router("/videos/", videos_router)
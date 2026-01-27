from ninja import Router
from typing import List
from .models import Video
from .schemas import VideoOutSchema, VideoCreateSchema
from django.contrib.auth import get_user_model

User = get_user_model()
router = Router()

@router.get("/videos", response=List[VideoOutSchema])
def list_videos(request):
# 1. HACK: If not logged in, grab the first user (You)
    user = request.user
    if not user.is_authenticated:
        user = User.objects.first()

    # 2. Now filter safely
    return Video.objects.filter(user=user)

@router.post("/", response=VideoOutSchema)
def create_video(request, payload: VideoCreateSchema):
    user = request.user
    if not user.is_authenticated:
        user = User.objects.first()

    video = Video.objects.create(
        user=user,
        **payload.dict()
    )
    return video
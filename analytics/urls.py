from django.urls import path

from .api import dashboard, top_videos, video_list, insights, import_video


urlpatterns = [
    path("videos/", video_list, name="video-list"),
    path("videos/import/", import_video, name="import-video"),
    path("videos/top/", top_videos, name="top-videos"),
    path("dashboard/", dashboard, name="dashboard"),
    path("insights/", insights, name="insights"),
]
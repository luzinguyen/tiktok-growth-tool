from django.contrib import admin
from .models import TikTokAccount, Video


@admin.register(TikTokAccount)
class TikTokAccountAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "followers",
        "following",
        "total_views",
        "updated_at",
    )
    search_fields = ("username",)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = (
        "video_id",
        "account",
        "views",
        "likes",
        "comments",
        "shares",
        "followers_gained",
        "posted_at",
    )
    search_fields = ("video_id", "title")
    list_filter = ("account",)
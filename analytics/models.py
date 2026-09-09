from django.db import models


class TikTokAccount(models.Model):
    username = models.CharField(max_length=100, unique=True)
    followers = models.PositiveIntegerField(default=0)
    following = models.PositiveIntegerField(default=0)
    total_views = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username


class Video(models.Model):
    account = models.ForeignKey(
        TikTokAccount,
        on_delete=models.CASCADE,
        related_name="videos",
    )
    video_id = models.CharField(max_length=100, unique=True)
    video_url = models.URLField(max_length=500, blank=True)
    title = models.CharField(max_length=255, blank=True)
    views = models.PositiveBigIntegerField(default=0)
    likes = models.PositiveBigIntegerField(default=0)
    comments = models.PositiveBigIntegerField(default=0)
    shares = models.PositiveBigIntegerField(default=0)
    followers_gained = models.PositiveIntegerField(default=0)
    posted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title or self.video_id
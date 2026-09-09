from .services.ranking import get_top_videos
from django.test import TestCase
from .models import TikTokAccount, Video
from .services.calculator import (
    calculate_engagement,
    calculate_follower_conversion,
    evaluate_video,
)
from .services.analyzer import analyze_video


class VideoAnalyticsTest(TestCase):

    def setUp(self):
        account = TikTokAccount.objects.create(
            username="test_channel",
            followers=1000,
        )

        self.video = Video.objects.create(
            account=account,
            video_id="test001",
            title="Test Video",
            views=10000,
            likes=800,
            comments=50,
            shares=100,
            followers_gained=150,
        )

    def test_engagement(self):
        result = calculate_engagement(self.video)

        self.assertEqual(result, 9.5)

    def test_follower_conversion(self):
        result = calculate_follower_conversion(self.video)

        self.assertEqual(result, 1.5)

    def test_video_evaluation(self):
        result = evaluate_video(self.video)

        self.assertEqual(result, "Excellent")

    def test_analyze_video(self):
        result = analyze_video(self.video)

        self.assertEqual(result["video_id"], "test001")
        self.assertEqual(result["title"], "Test Video")
        self.assertEqual(result["views"], 10000)

        self.assertEqual(result["engagement"], 9.5)
        self.assertEqual(result["follower_conversion"], 1.5)

        self.assertEqual(result["engagement_status"], "Excellent")
        self.assertEqual(result["conversion_status"], "Excellent")
    def test_top_videos(self):
        video2 = Video.objects.create(
            account=self.video.account,
            video_id="test002",
            title="Better Video",
            views=10000,
            likes=1000,
            comments=100,
            shares=100,
            followers_gained=200,
        )

        video3 = Video.objects.create(
            account=self.video.account,
            video_id="test003",
            title="Best Video",
            views=10000,
            likes=1500,
            comments=100,
            shares=200,
            followers_gained=300,
        )

        videos = Video.objects.all()

        result = get_top_videos(videos)

        self.assertEqual(len(result), 3)
        self.assertEqual(result[0].video_id, "test003")
        self.assertEqual(result[1].video_id, "test002")
        self.assertEqual(result[2].video_id, "test001")
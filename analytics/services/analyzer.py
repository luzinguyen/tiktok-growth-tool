from .calculator import (
    calculate_engagement,
    calculate_follower_conversion,
)


def analyze_video(video):
    engagement = calculate_engagement(video)
    conversion = calculate_follower_conversion(video)

    result = {
        "video_id": video.video_id,
        "title": video.title,
        "views": video.views,
        "engagement": engagement,
        "follower_conversion": conversion,
    }

    if engagement >= 8:
        result["engagement_status"] = "Excellent"
    elif engagement >= 5:
        result["engagement_status"] = "Good"
    else:
        result["engagement_status"] = "Low"

    if conversion >= 1:
        result["conversion_status"] = "Excellent"
    elif conversion >= 0.5:
        result["conversion_status"] = "Good"
    else:
        result["conversion_status"] = "Low"

    return result
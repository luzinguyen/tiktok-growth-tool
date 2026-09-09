def calculate_engagement(video):
    if video.views == 0:
        return 0

    engagement = (
        video.likes
        + video.comments
        + video.shares
    ) / video.views * 100

    return round(engagement, 2)
def calculate_follower_conversion(video):
    if video.views == 0:
        return 0

    conversion = (
        video.followers_gained / video.views
    ) * 100

    return round(conversion, 2)
def evaluate_video(video):
    engagement = calculate_engagement(video)
    conversion = calculate_follower_conversion(video)

    if engagement >= 8 and conversion >= 1:
        return "Excellent"

    if engagement >= 5 and conversion >= 0.5:
        return "Good"

    return "Needs improvement"
from .calculator import calculate_engagement


def get_top_videos(videos, limit=5):
    videos = list(videos)

    videos.sort(
        key=calculate_engagement,
        reverse=True,
    )

    return videos[:limit]
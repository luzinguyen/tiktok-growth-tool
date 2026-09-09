from django.db.models import Sum, Avg, Max


def calculate_engagement_rate(views, likes, comments, shares):
    if views <= 0:
        return 0

    engagement = likes + comments + shares
    return round((engagement / views) * 100, 2)


def get_account_insights(account):
    videos = account.videos.all()

    video_count = videos.count()

    if video_count == 0:
        return {
            "account": {
                "username": account.username,
                "followers": account.followers,
                "following": account.following,
                "total_views": account.total_views,
            },
            "summary": {
                "video_count": 0,
                "total_video_views": 0,
                "total_likes": 0,
                "total_comments": 0,
                "total_shares": 0,
                "total_followers_gained": 0,
                "average_views": 0,
                "engagement_rate": 0,
            },
            "performance": {
                "best_video": None,
                "worst_video": None,
            },
            "recommendations": [
                "Chưa có dữ liệu video để phân tích."
            ],
        }

    stats = videos.aggregate(
        total_views=Sum("views"),
        total_likes=Sum("likes"),
        total_comments=Sum("comments"),
        total_shares=Sum("shares"),
        total_followers_gained=Sum("followers_gained"),
        average_views=Avg("views"),
        max_views=Max("views"),
    )

    total_views = stats["total_views"] or 0
    total_likes = stats["total_likes"] or 0
    total_comments = stats["total_comments"] or 0
    total_shares = stats["total_shares"] or 0
    total_followers_gained = stats["total_followers_gained"] or 0
    average_views = round(stats["average_views"] or 0)

    engagement_rate = calculate_engagement_rate(
        total_views,
        total_likes,
        total_comments,
        total_shares,
    )

    best_video = videos.order_by("-views").first()
    worst_video = videos.order_by("views").first()

    recommendations = []

    # Phân tích engagement
    if engagement_rate >= 10:
        recommendations.append(
            "Engagement rate rất tốt. Nên tiếp tục phát triển nội dung hiện tại."
        )
    elif engagement_rate >= 5:
        recommendations.append(
            "Engagement rate khá tốt. Có thể tối ưu hook và CTA để tăng tương tác."
        )
    elif engagement_rate >= 2:
        recommendations.append(
            "Engagement rate ở mức trung bình. Nên cải thiện nội dung và lời kêu gọi tương tác."
        )
    else:
        recommendations.append(
            "Engagement rate thấp. Cần tập trung cải thiện hook, nội dung và CTA."
        )

    # Phân tích lượt xem
    if average_views > 0:
        if best_video and best_video.views >= average_views * 2:
            recommendations.append(
                "Có video vượt xa mức view trung bình. Nên phân tích format và chủ đề của video này."
            )

    # Phân tích follower
    if total_followers_gained > 0 and total_views > 0:
        follower_conversion = round(
            (total_followers_gained / total_views) * 100,
            2,
        )

        if follower_conversion < 0.5:
            recommendations.append(
                "Tỷ lệ chuyển đổi người xem thành follower còn thấp. "
                "Nên tăng CTA follow và xây dựng series nội dung."
            )
        else:
            recommendations.append(
                "Khả năng chuyển đổi người xem thành follower đang khá tốt."
            )
    else:
        follower_conversion = 0

    return {
        "account": {
            "username": account.username,
            "followers": account.followers,
            "following": account.following,
            "total_views": account.total_views,
        },
        "summary": {
            "video_count": video_count,
            "total_video_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_shares": total_shares,
            "total_followers_gained": total_followers_gained,
            "average_views": average_views,
            "engagement_rate": engagement_rate,
            "follower_conversion_rate": follower_conversion,
        },
        "performance": {
            "best_video": {
                "video_id": best_video.video_id,
                "title": best_video.title,
                "views": best_video.views,
                "likes": best_video.likes,
                "comments": best_video.comments,
                "shares": best_video.shares,
                "followers_gained": best_video.followers_gained,
            } if best_video else None,

            "worst_video": {
                "video_id": worst_video.video_id,
                "title": worst_video.title,
                "views": worst_video.views,
                "likes": worst_video.likes,
                "comments": worst_video.comments,
                "shares": worst_video.shares,
                "followers_gained": worst_video.followers_gained,
            } if worst_video else None,
        },
        "recommendations": recommendations,
    }
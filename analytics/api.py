from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum

from .models import TikTokAccount, Video


# ============================================================
# CALCULATE VIDEO METRICS
# ============================================================

def calculate_video_metrics(video):
    views = int(video.views or 0)
    likes = int(video.likes or 0)
    comments = int(video.comments or 0)
    shares = int(video.shares or 0)
    followers_gained = int(video.followers_gained or 0)

    total_engagement = (
        likes +
        comments +
        shares
    )

    # Engagement Rate
    if views > 0:
        engagement = (
            total_engagement /
            views *
            100
        )
    else:
        engagement = 0

    # Follower Conversion
    if views > 0:
        follower_conversion = (
            followers_gained /
            views *
            100
        )
    else:
        follower_conversion = 0

    # Engagement Status
    if engagement >= 10:
        engagement_status = "Excellent"
    elif engagement >= 5:
        engagement_status = "Good"
    elif engagement >= 3:
        engagement_status = "Average"
    else:
        engagement_status = "Needs Improvement"

    # Conversion Status
    if follower_conversion >= 2:
        conversion_status = "Excellent"
    elif follower_conversion >= 1:
        conversion_status = "Good"
    elif follower_conversion >= 0.5:
        conversion_status = "Average"
    else:
        conversion_status = "Needs Improvement"

    return {
        "engagement": round(
            engagement,
            2
        ),

        "follower_conversion": round(
            follower_conversion,
            2
        ),

        "engagement_status":
            engagement_status,

        "conversion_status":
            conversion_status,
    }


# ============================================================
# AI SCORE
# ============================================================

def calculate_ai_score(video):
    metrics = calculate_video_metrics(video)

    engagement = metrics["engagement"]
    conversion = metrics["follower_conversion"]
    views = int(video.views or 0)

    # --------------------------------------------------------
    # Engagement = 40 points
    # --------------------------------------------------------

    if engagement >= 10:
        engagement_score = 40
    elif engagement >= 7:
        engagement_score = 32
    elif engagement >= 5:
        engagement_score = 24
    else:
        engagement_score = 15

    # --------------------------------------------------------
    # Conversion = 30 points
    # --------------------------------------------------------

    if conversion >= 2:
        conversion_score = 30
    elif conversion >= 1.5:
        conversion_score = 25
    elif conversion >= 1:
        conversion_score = 20
    else:
        conversion_score = 10

    # --------------------------------------------------------
    # Views = 30 points
    # --------------------------------------------------------

    if views >= 50000:
        views_score = 30
    elif views >= 30000:
        views_score = 25
    elif views >= 10000:
        views_score = 20
    else:
        views_score = 10

    total_score = min(
        engagement_score +
        conversion_score +
        views_score,
        100
    )

    return {
        "score": total_score,

        "engagement_score":
            engagement_score,

        "conversion_score":
            conversion_score,

        "views_score":
            views_score,
    }


# ============================================================
# VIRAL POTENTIAL
# ============================================================

def get_viral_potential(score):

    if score >= 85:
        return "Very High"

    if score >= 70:
        return "High"

    if score >= 50:
        return "Medium"

    return "Low"


# ============================================================
# CONTENT QUALITY
# ============================================================

def get_content_quality(engagement):

    if engagement >= 10:
        return "Excellent"

    if engagement >= 7:
        return "Good"

    if engagement >= 5:
        return "Average"

    return "Needs Improvement"


# ============================================================
# GROWTH OPPORTUNITY
# ============================================================

def get_growth_opportunity(
    engagement,
    conversion
):

    if (
        engagement >= 10
        and conversion >= 2
    ):
        return {
            "key": "scale",
            "label": "SCALE",
            "title": "Scale this content",
            "description": (
                "Nội dung đang hoạt động tốt. "
                "Hãy tạo thêm video cùng format."
            ),
        }

    if (
        engagement >= 7
        and conversion < 2
    ):
        return {
            "key": "improve-cta",
            "label": "IMPROVE CTA",
            "title": "Improve CTA",
            "description": (
                "Nội dung tốt nhưng cần CTA mạnh hơn "
                "để tăng follower."
            ),
        }

    if (
        engagement < 7
        and conversion >= 1.5
    ):
        return {
            "key": "fix-hook",
            "label": "FIX HOOK",
            "title": "Fix Hook",
            "description": (
                "Cải thiện hook và retention "
                "để giữ người xem lâu hơn."
            ),
        }

    return {
        "key": "test-hook",
        "label": "TEST HOOK",
        "title": "Test stronger Hook",
        "description": (
            "Thử một hook mạnh hơn "
            "để cải thiện hiệu suất video."
        ),
    }


# ============================================================
# ANOMALY DETECTION
# ============================================================

def detect_anomaly(video):

    metrics = calculate_video_metrics(video)

    engagement = metrics["engagement"]
    conversion = metrics["follower_conversion"]
    views = int(video.views or 0)

    reasons = []

    if engagement > 30:
        reasons.append(
            "Engagement rate is unusually high"
        )

    if conversion > 10:
        reasons.append(
            "Follower conversion is unusually high"
        )

    if views <= 0:
        reasons.append(
            "Video has zero views"
        )

    return {
        "is_anomaly":
            len(reasons) > 0,

        "reasons":
            reasons,
    }


# ============================================================
# AI ANALYSIS
# ============================================================

def generate_ai_analysis(video):

    metrics = calculate_video_metrics(video)

    views = int(video.views or 0)
    engagement = metrics["engagement"]
    conversion = metrics["follower_conversion"]

    analysis = []

    # --------------------------------------------------------
    # Views
    # --------------------------------------------------------

    if views >= 50000:

        analysis.append(
            "Video có lượng view rất cao, "
            "cho thấy chủ đề hoặc format đang "
            "có khả năng tiếp cận tốt."
        )

    elif views >= 20000:

        analysis.append(
            "Video có khả năng tiếp cận khá tốt "
            "và đang nằm trong nhóm nội dung "
            "có tiềm năng."
        )

    else:

        analysis.append(
            "Lượng view còn có thể cải thiện "
            "bằng cách tối ưu hook trong những "
            "giây đầu tiên."
        )

    # --------------------------------------------------------
    # Engagement
    # --------------------------------------------------------

    if engagement >= 10:

        analysis.append(
            "Engagement rất cao. Nên giữ lại "
            "format, chủ đề và cách triển khai "
            "tương tự."
        )

    elif engagement >= 5:

        analysis.append(
            "Engagement ở mức khá tốt. Có thể "
            "thử CTA mạnh hơn để tăng comment "
            "và share."
        )

    else:

        analysis.append(
            "Engagement thấp. Nên thử hook mới, "
            "nội dung ngắn hơn hoặc CTA rõ ràng hơn."
        )

    # --------------------------------------------------------
    # Conversion
    # --------------------------------------------------------

    if conversion >= 2:

        analysis.append(
            "Khả năng chuyển đổi người xem "
            "thành follower rất tốt."
        )

    elif conversion >= 1:

        analysis.append(
            "Video có khả năng chuyển đổi "
            "follower khá tốt."
        )

    else:

        analysis.append(
            "Nên thêm lý do rõ ràng để người xem "
            "follow tài khoản sau khi xem video."
        )

    return analysis


# ============================================================
# SERIALIZE VIDEO
# ============================================================

def serialize_video(video):

    if not video:
        return None

    metrics = calculate_video_metrics(video)

    ai = calculate_ai_score(video)

    anomaly = detect_anomaly(video)
    growth_opportunity = get_growth_opportunity(
    metrics["engagement"],
    metrics["follower_conversion"]
)
    return {

        "video_id":
            video.video_id,

        "title":
            video.title,

        "views":
            video.views,

        "likes":
            video.likes,

        "comments":
            video.comments,

        "shares":
            video.shares,

        "followers_gained":
            video.followers_gained,

        "posted_at":
            video.posted_at,

        # ----------------------------------------------------
        # Calculated Metrics
        # ----------------------------------------------------

        "engagement":
            metrics["engagement"],

        "follower_conversion":
            metrics["follower_conversion"],

        "engagement_status":
            metrics["engagement_status"],

        "conversion_status":
            metrics["conversion_status"],

        # ----------------------------------------------------
        # AI Score
        # ----------------------------------------------------

        "ai_score":
            ai["score"],

        "ai_score_breakdown": {

            "engagement":
                ai["engagement_score"],

            "conversion":
                ai["conversion_score"],

            "views":
                ai["views_score"],
        },

        # ----------------------------------------------------
        # AI Classification
        # ----------------------------------------------------

        "viral_potential":
            get_viral_potential(
                ai["score"]
            ),

        "content_quality":
            get_content_quality(
                metrics["engagement"]
            ),

    

        # ----------------------------------------------------
        # AI Analysis
        # ----------------------------------------------------

        "ai_analysis":
            generate_ai_analysis(video),

        # ----------------------------------------------------
        # Anomaly
        # ----------------------------------------------------

        "anomaly":
            anomaly,

        "growth_opportunity":
            growth_opportunity,
    }


# ============================================================
# ACCOUNT
# ============================================================

def get_account():

    return TikTokAccount.objects.first()


# ============================================================
# VIDEOS
# ============================================================

def video_list(request):

    account = get_account()

    if not account:

        return JsonResponse(
            [],
            safe=False
        )

    videos = Video.objects.filter(
        account=account
    ).order_by(
        "-views"
    )

    data = [
        serialize_video(video)
        for video in videos
    ]

    return JsonResponse(
        data,
        safe=False
    )


# ============================================================
# TOP VIDEOS
# ============================================================

def top_videos(request):

    account = get_account()

    if not account:

        return JsonResponse(
            [],
            safe=False
        )

    videos = Video.objects.filter(
        account=account
    ).order_by(
        "-views"
    )[:10]

    data = [
        serialize_video(video)
        for video in videos
    ]

    return JsonResponse(
        data,
        safe=False
    )


# ============================================================
# DASHBOARD
# ============================================================

def dashboard(request):

    account = get_account()

    if not account:

        return JsonResponse({

            "account": None,

            "summary": {},

            "top_videos": [],

            "ai_summary": {},
        })

    videos = Video.objects.filter(
        account=account
    )

    # --------------------------------------------------------
    # Aggregates
    # --------------------------------------------------------

    total_views = (
        videos.aggregate(
            total=Sum("views")
        )["total"] or 0
    )

    total_likes = (
        videos.aggregate(
            total=Sum("likes")
        )["total"] or 0
    )

    total_comments = (
        videos.aggregate(
            total=Sum("comments")
        )["total"] or 0
    )

    total_shares = (
        videos.aggregate(
            total=Sum("shares")
        )["total"] or 0
    )

    total_followers_gained = (
        videos.aggregate(
            total=Sum("followers_gained")
        )["total"] or 0
    )

    total_videos = videos.count()

    # --------------------------------------------------------
    # Top videos by views
    # --------------------------------------------------------

    top = videos.order_by(
        "-views"
    )[:10]

    # --------------------------------------------------------
    # AI summary
    # --------------------------------------------------------

    scored_videos = []

    for video in videos:

        ai = calculate_ai_score(video)

        anomaly = detect_anomaly(video)

        scored_videos.append({
            "video": video,
            "score": ai["score"],
            "anomaly": anomaly["is_anomaly"],
        })

    if scored_videos:

        average_ai_score = (
            sum(
                item["score"]
                for item in scored_videos
            )
            /
            len(scored_videos)
        )

        viral_videos = sum(
            1
            for item in scored_videos
            if item["score"] >= 70
        )

        anomaly_videos = sum(
            1
            for item in scored_videos
            if item["anomaly"]
        )

    else:

        average_ai_score = 0
        viral_videos = 0
        anomaly_videos = 0

    return JsonResponse({

        "account": {

            "username":
                account.username,

            "followers":
                account.followers,

            "following":
                account.following,

            "total_views":
                account.total_views,
        },

        "summary": {

            "total_views":
                total_views,

            "total_likes":
                total_likes,

            "total_comments":
                total_comments,

            "total_shares":
                total_shares,

            "total_followers_gained":
                total_followers_gained,

            "total_videos":
                total_videos,

            "video_count":
                total_videos,
        },

        "ai_summary": {

            "average_ai_score":
                round(
                    average_ai_score,
                    2
                ),

            "viral_videos":
                viral_videos,

            "anomaly_videos":
                anomaly_videos,
        },

        "top_videos": [
            serialize_video(video)
            for video in top
        ],
    })


# ============================================================
# ACCOUNT INSIGHTS
# ============================================================

def insights(request):

    account = get_account()

    if not account:

        return JsonResponse({

            "account": None,

            "summary": {},

            "performance": {},

            "ai_summary": {},

            "recommendations": [],
        })


    videos = list(
        Video.objects.filter(
            account=account
        )
    )

    video_count = len(videos)


    # ========================================================
    # BASIC AGGREGATES
    # ========================================================

    total_views = sum(
        int(video.views or 0)
        for video in videos
    )

    total_likes = sum(
        int(video.likes or 0)
        for video in videos
    )

    total_comments = sum(
        int(video.comments or 0)
        for video in videos
    )

    total_shares = sum(
        int(video.shares or 0)
        for video in videos
    )

    total_followers_gained = sum(
        int(video.followers_gained or 0)
        for video in videos
    )
    


    # ========================================================
    # AVERAGE VIEWS
    # ========================================================

    average_views = (

        total_views /
        video_count

        if video_count

        else 0
    )


    # ========================================================
    # OVERALL ENGAGEMENT
    # ========================================================

    total_engagement = (
        total_likes +
        total_comments +
        total_shares
    )

    engagement_rate = (

        total_engagement /
        total_views *
        100

        if total_views

        else 0
    )


    # ========================================================
    # FOLLOWER CONVERSION
    # ========================================================

    follower_conversion_rate = (

        total_followers_gained /
        total_views *
        100

        if total_views

        else 0
    )


    # ========================================================
    # SCORE ALL VIDEOS
    # ========================================================

    scored_videos = []

    for video in videos:

        metrics = calculate_video_metrics(
            video
        )

        ai = calculate_ai_score(
            video
        )

        anomaly = detect_anomaly(
            video
        )

        scored_videos.append({

            "video":
                video,

            "score":
                ai["score"],

            "engagement":
                metrics["engagement"],

            "conversion":
                metrics["follower_conversion"],

            "views":
                int(video.views or 0),

            "viral":
                get_viral_potential(
                    ai["score"]
                ),

            "anomaly":
                anomaly,

        })


    # ========================================================
    # BEST / WORST VIDEO
    # ========================================================

    best_video = None
    worst_video = None

    if scored_videos:

        sorted_by_score = sorted(
            scored_videos,
            key=lambda item:
                item["score"],
            reverse=True
        )

        best_video = sorted_by_score[0]["video"]

        worst_video = sorted_by_score[-1]["video"]


    # ========================================================
    # AVERAGE AI SCORE
    # ========================================================

    if scored_videos:

        average_ai_score = (

            sum(
                item["score"]
                for item in scored_videos
            )
            /
            len(scored_videos)

        )

    else:

        average_ai_score = 0


    # ========================================================
    # VIRAL VIDEOS
    # ========================================================

    very_high_videos = [
        item
        for item in scored_videos
        if item["score"] >= 85
    ]

    high_videos = [
        item
        for item in scored_videos
        if 70 <= item["score"] < 85
    ]


    # ========================================================
    # ANOMALIES
    # ========================================================

    anomaly_videos = [
        item
        for item in scored_videos
        if item["anomaly"]["is_anomaly"]
    ]


    # ========================================================
    # HIGH ENGAGEMENT VIDEOS
    # ========================================================

    high_engagement_videos = [
        item
        for item in scored_videos
        if item["engagement"] >= 10
    ]


    # ========================================================
    # HIGH CONVERSION VIDEOS
    # ========================================================

    high_conversion_videos = [
        item
        for item in scored_videos
        if item["conversion"] >= 2
    ]


    # ========================================================
    # RECOMMENDATIONS
    # ========================================================

    recommendations = []


    # --------------------------------------------------------
    # Recommendation 1:
    # Best video
    # --------------------------------------------------------

    if best_video:

        best_ai = calculate_ai_score(
            best_video
        )

        best_metrics = calculate_video_metrics(
            best_video
        )

        if best_ai["score"] >= 85:

            recommendations.append(
                f"Scale format của video "
                f"'{best_video.title}'. "
                f"Video đang đạt AI Score "
                f"{best_ai['score']}/100."
            )

        elif best_ai["score"] >= 70:

            recommendations.append(
                f"Tiếp tục thử nghiệm format "
                f"của video '{best_video.title}'. "
                f"Video có AI Score "
                f"{best_ai['score']}/100."
            )


    # --------------------------------------------------------
    # Recommendation 2:
    # Engagement
    # --------------------------------------------------------

    if engagement_rate < 5:

        recommendations.append(
            "Engagement tổng thể còn thấp. "
            "Ưu tiên cải thiện hook trong "
            "1–3 giây đầu và tạo nội dung "
            "khiến người xem muốn comment/share."
        )

    elif engagement_rate < 7:

        recommendations.append(
            "Engagement đang ở mức trung bình. "
            "Hãy thử CTA rõ ràng hơn và "
            "tăng yếu tố kích thích comment/share."
        )

    else:

        recommendations.append(
            "Engagement tổng thể đang tốt. "
            "Nên tiếp tục thử nghiệm các "
            "chủ đề có khả năng tạo tương tác cao."
        )


    # --------------------------------------------------------
    # Recommendation 3:
    # Conversion
    # --------------------------------------------------------

    if follower_conversion_rate < 1:

        recommendations.append(
            "Follower conversion dưới 1%. "
            "Nên thêm CTA follow rõ ràng và "
            "cho người xem một lý do cụ thể "
            "để theo dõi các video tiếp theo."
        )

    elif follower_conversion_rate < 2:

        recommendations.append(
            "Follower conversion khá tốt nhưng "
            "vẫn có thể tăng bằng CTA cuối video "
            "và xây dựng series nội dung."
        )

    else:

        recommendations.append(
            "Follower conversion rất tốt. "
            "Nên xây dựng series dựa trên các "
            "format đang chuyển đổi follower hiệu quả."
        )


    # --------------------------------------------------------
    # Recommendation 4:
    # Views
    # --------------------------------------------------------

    if average_views < 10000:

        recommendations.append(
            "Average views còn thấp. "
            "Hãy tập trung test nhiều hook khác nhau "
            "và đăng đều để tìm format có khả năng "
            "được phân phối tốt."
        )

    elif average_views < 30000:

        recommendations.append(
            "Average views đang ở mức khá. "
            "Hãy nhân rộng các chủ đề có video "
            "đạt trên 30K views."
        )

    else:

        recommendations.append(
            "Average views cao. "
            "Nên ưu tiên scale những format "
            "đang tạo ra lượng reach lớn."
        )


    # --------------------------------------------------------
    # Recommendation 5:
    # Anomaly
    # --------------------------------------------------------

    if anomaly_videos:

        recommendations.append(
            f"Phát hiện {len(anomaly_videos)} "
            f"video có dữ liệu bất thường. "
            "Nên kiểm tra dữ liệu trước khi "
            "dùng chúng để đánh giá chiến lược."
        )


    # ========================================================
    # LIMIT RECOMMENDATIONS
    # ========================================================

    recommendations = recommendations[:5]


    # ========================================================
    # CONTENT FORMAT INSIGHT
    # ========================================================

    if high_engagement_videos:

        content_strategy = (
            "Tài khoản đang có format tạo "
            "engagement tốt. Ưu tiên nhân rộng "
            "các video có engagement từ 10% trở lên."
        )

    elif high_conversion_videos:

        content_strategy = (
            "Tài khoản đang có khả năng chuyển đổi "
            "follower tốt. Nên tập trung xây dựng "
            "series nội dung để tăng follower."
        )

    else:

        content_strategy = (
            "Chưa có format nổi bật rõ ràng. "
            "Nên tiếp tục A/B test hook, chủ đề "
            "và CTA."
        )


    # ========================================================
    # AI ACCOUNT HEALTH
    # ========================================================

    if average_ai_score >= 85:

        account_health = "Excellent"

    elif average_ai_score >= 70:

        account_health = "Good"

    elif average_ai_score >= 50:

        account_health = "Average"

    else:

        account_health = "Needs Improvement"


    # ========================================================
    # RESPONSE
    # ========================================================

    return JsonResponse({

        "account": {

            "username":
                account.username,

            "followers":
                account.followers,

            "following":
                account.following,
        },


        # ====================================================
        # BASIC SUMMARY
        # ====================================================

        "summary": {

            "video_count":
                video_count,

            "total_video_views":
                total_views,

            "average_views":
                round(
                    average_views,
                    2
                ),

            "engagement_rate":
                round(
                    engagement_rate,
                    2
                ),

            "follower_conversion_rate":
                round(
                    follower_conversion_rate,
                    2
                ),

            "total_followers_gained":
                total_followers_gained,
        },


        # ====================================================
        # AI SUMMARY
        # ====================================================

        "ai_summary": {

            "average_ai_score":
                round(
                    average_ai_score,
                    2
                ),

            "account_health":
                account_health,

            "very_high_viral_videos":
                len(very_high_videos),

            "high_viral_videos":
                len(high_videos),

            "viral_videos":
                len(
                    very_high_videos
                )
                +
                len(
                    high_videos
                ),

            "anomaly_videos":
                len(anomaly_videos),

            "high_engagement_videos":
                len(high_engagement_videos),

            "high_conversion_videos":
                len(high_conversion_videos),

            "content_strategy":
                content_strategy,
        },


        # ====================================================
        # PERFORMANCE
        # ====================================================

        "performance": {

            "best_video":
                serialize_video(
                    best_video
                )
                if best_video
                else None,

            "worst_video":
                serialize_video(
                    worst_video
                )
                if worst_video
                else None,
        },


        # ====================================================
        # RECOMMENDATIONS
        # ====================================================

        "recommendations":
            recommendations,


        # ====================================================
        # ANOMALY DETAILS
        # ====================================================

        "anomalies": [

            {
                "video":
                    serialize_video(
                        item["video"]
                    ),

                "reasons":
                    item["anomaly"]["reasons"],
            }

            for item in anomaly_videos
        ],
        

    })
@csrf_exempt
def import_video(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405
        )

    import json

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    video_url = data.get("video_url")

    if not video_url:
        return JsonResponse(
            {"error": "video_url is required"},
            status=400
        )

    account = TikTokAccount.objects.first()

    if not account:
        return JsonResponse(
        {"error": "TikTok account not found"},
        status=400
    )

    video_id = video_url.rstrip("/").split("/")[-1].split("?")[0]

    video, created = Video.objects.get_or_create(
        video_id=video_id,
        defaults={
        "account": account,
        "video_url": video_url,
        "title": "Imported TikTok Video",
    },
)

    return JsonResponse({
    "message": "Video imported successfully",
    "created": created,
    "video": serialize_video(video),
})
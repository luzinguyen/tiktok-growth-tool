import { useEffect, useState } from "react";
import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

/* =========================================================
   GENERAL HELPERS
========================================================= */

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString();
};

const formatPercent = (value) => {
  return Number(value || 0).toFixed(2);
};

const getVideoTitle = (video) => {
  return video?.title || video?.video_id || "Untitled Video";
};

const getStatusClass = (status) => {
  if (!status) return "";

  return status.toLowerCase().replace(/\s+/g, "-");
};
function getScoreStatus(score) {
  const value = Number(score || 0);

  if (value >= 85) {
    return {
      label: "Excellent",
      className: "score-excellent",
    };
  }

  if (value >= 70) {
    return {
      label: "Good",
      className: "score-good",
    };
  }

  if (value >= 50) {
    return {
      label: "Average",
      className: "score-average",
    };
  }

  return {
    label: "Needs Improvement",
    className: "score-low",
  };
}

/* =========================================================
   VIDEO DETAIL PAGE
   Backend là nguồn AI chính
========================================================= */

function VideoDetailPage({ video, onBack }) {
  const score = Number(video?.ai_score || 0);

  const engagement = Number(video?.engagement || 0);

  const conversion = Number(video?.follower_conversion || 0);

  const views = Number(video?.views || 0);
  const scoreStatus = getScoreStatus(score);

  /* =======================================================
     AI SCORE FROM BACKEND
  ======================================================= */

  const engagementScore = Number(video?.ai_score_breakdown?.engagement || 0);

  const conversionScore = Number(video?.ai_score_breakdown?.conversion || 0);

  const viewsScore = Number(video?.ai_score_breakdown?.views || 0);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const engagementChartData = [
    {
      name: "Likes",
      value: Number(video?.likes || 0),
    },
    {
      name: "Comments",
      value: Number(video?.comments || 0),
    },
    {
      name: "Shares",
      value: Number(video?.shares || 0),
    },
  ];

  const scoreChartData = [
    {
      name: "Engagement",
      value: engagementScore,
    },
    {
      name: "Conversion",
      value: conversionScore,
    },
    {
      name: "Views",
      value: viewsScore,
    },
  ];

  /* =======================================================
     ANOMALY FROM BACKEND
  ======================================================= */

  const isAnomaly = video?.anomaly?.is_anomaly || false;

  const anomalyReasons = Array.isArray(video?.anomaly?.reasons)
    ? video.anomaly.reasons
    : [];

  /* =======================================================
     AI ANALYSIS FROM BACKEND
  ======================================================= */

  const aiAnalysis = Array.isArray(video?.ai_analysis) ? video.ai_analysis : [];
  const growthOpportunity = video?.growth_opportunity || "Test a stronger hook";

  const getActionInfo = (opportunity) => {
    const value = opportunity.toLowerCase();

    if (value.includes("scale")) {
      return {
        label: "SCALE",
        className: "scale",
        title: "Scale this content",
        description:
          "Nội dung đang hoạt động tốt. Hãy tạo thêm video cùng format này.",
      };
    }

    if (value.includes("cta")) {
      return {
        label: "IMPROVE CTA",
        className: "improve-cta",
        title: "Improve your CTA",
        description: "Nội dung tốt nhưng cần CTA mạnh hơn để tăng follower.",
      };
    }

    if (value.includes("hook") && value.includes("retention")) {
      return {
        label: "FIX HOOK",
        className: "fix-hook",
        title: "Fix Hook & Retention",
        description: "Cải thiện hook và retention để giữ người xem lâu hơn.",
      };
    }

    return {
      label: "TEST HOOK",
      className: "test-hook",
      title: "Test stronger Hook",
      description: "Thử một hook mạnh hơn để cải thiện hiệu suất video.",
    };
  };

  const actionInfo = getActionInfo(growthOpportunity);
  return (
    <main className="video-detail-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="video-detail-top">
        <button className="back-button" onClick={onBack}>
          ← Back to Videos
        </button>
        <div className="video-detail-heading">
          <div>
            <p className="eyebrow">VIDEO ANALYTICS</p>
            <h1>{getVideoTitle(video)}</h1>
            <span className="video-id">ID: {video?.video_id || "N/A"}</span>
          </div>

          {/* AI SCORE */}
          <div className="video-score-large">
            <span>AI SCORE</span>

            <div className="ai-score-number">
              <strong>{score}</strong>
              <small>/100</small>
            </div>
            <div className="ai-score-progress">
              <div
                className={`ai-score-progress-bar ${scoreStatus.className}`}
                style={{
                  width: `${Math.min(score, 100)}%`,
                }}
              />
            </div>
            <span className={`ai-score-status ${scoreStatus.className}`}>
              {scoreStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN METRICS
      ===================================================== */}

      <div className="video-detail-metrics">
        <div className="video-metric-card">
          <span>👀</span>
          <small>Views</small>
          <strong>{formatNumber(video?.views)}</strong>
        </div>
        <div className="video-metric-card">
          <span>❤️</span>
          <small>Likes</small>
          <strong>{formatNumber(video?.likes)}</strong>
        </div>
        <div className="video-metric-card">
          <span>💬</span>
          <small>Comments</small>
          <strong>{formatNumber(video?.comments)}</strong>
        </div>
        <div className="video-metric-card">
          <span>🔄</span>
          <small>Shares</small>
          <strong>{formatNumber(video?.shares)}</strong>
        </div>
        <div className="video-metric-card">
          <span>👤</span>
          <small>Followers Gained</small>
          <strong>+{formatNumber(video?.followers_gained)}</strong>
        </div>
        <div className="video-metric-card">
          <span>📈</span>
          <small>Engagement</small>
          <strong>{formatPercent(video?.engagement)}%</strong>
        </div>
      </div>

      {/* =====================================================
          PERFORMANCE + AI INSIGHTS
      ===================================================== */}

      <div className="video-detail-grid">
        {/* PERFORMANCE */}

        <div className="detail-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">PERFORMANCE</p>
              <h2>Video Performance</h2>
            </div>
          </div>
          <div className="performance-list">
            <div className="performance-row">
              <span>Engagement Rate</span>

              <strong>{formatPercent(video?.engagement)}%</strong>
            </div>
            <div className="performance-row">
              <span>Follower Conversion</span>
              <strong>{formatPercent(video?.follower_conversion)}%</strong>
            </div>
            <div className="performance-row">
              <span>Engagement Status</span>
              <strong
                className={`status ${getStatusClass(video?.engagement_status)}`}
              >
                {video?.engagement_status || "N/A"}
              </strong>
            </div>
            <div className="performance-row">
              <span>Conversion Status</span>
              <strong
                className={`status ${getStatusClass(video?.conversion_status)}`}
              >
                {video?.conversion_status || "N/A"}
              </strong>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="detail-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">AI INSIGHTS</p>
              <h2>Content Intelligence</h2>
            </div>
            <span className="ai-icon">🤖</span>
          </div>
          <div className="ai-insight-list">
            <div className="ai-insight">
              <span>🔥</span>
              <div>
                <small>Viral Potential</small>
                <strong>{video?.viral_potential || "N/A"}</strong>
              </div>
            </div>
            <div className="ai-insight">
              <span>✨</span>
              <div>
                <small>Content Quality</small>
                <strong>{video?.content_quality || "N/A"}</strong>
              </div>
            </div>
            <div className="ai-insight">
              <span>📈</span>
              <div>
                <small>Growth Opportunity</small>
                <strong>{video?.growth_opportunity || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
                          ENGAGEMENT BREAKDOWN
      ===================================================== */}

      <div className="video-detail-grid">
        {/* ENGAGEMENT DATA */}

        <div className="detail-panel engagement-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">ENGAGEMENT</p>

              <h2>Engagement Breakdown</h2>
            </div>

            <strong className="panel-number">
              {formatPercent(video?.engagement)}%
            </strong>
          </div>

          <div className="breakdown-grid">
            <div className="breakdown-item">
              <span>❤️ Likes</span>

              <strong>{formatNumber(video?.likes)}</strong>
            </div>

            <div className="breakdown-item">
              <span>💬 Comments</span>

              <strong>{formatNumber(video?.comments)}</strong>
            </div>

            <div className="breakdown-item">
              <span>🔄 Shares</span>

              <strong>{formatNumber(video?.shares)}</strong>
            </div>
          </div>
        </div>

        {/* ENGAGEMENT CHART */}

        <div className="detail-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">INTERACTIONS</p>

              <h2>Engagement Volume</h2>
            </div>
          </div>

          <div className="detail-chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={engagementChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  name="Interactions"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =====================================================
                            AI SCORE BREAKDOWN
      ===================================================== */}

      <div className="detail-panel ai-score-breakdown">
        <div className="panel-title">
          <div>
            <p className="eyebrow">AI SCORING</p>

            <h2>AI Score Breakdown</h2>
          </div>

          <div className="score-total">{score}/100</div>
        </div>

        <div className="score-breakdown-grid">
          <div className="score-breakdown-card">
            <span>📊</span>

            <div>
              <small>Engagement</small>

              <strong>{engagementScore}/40</strong>
            </div>
          </div>
          <div className="score-breakdown-card">
            <span>👤</span>
            <div>
              <small>Conversion</small>
              <strong>{conversionScore}/30</strong>
            </div>
          </div>
          <div className="score-breakdown-card">
            <span>👀</span>
            <div>
              <small>Views</small>
              <strong>{viewsScore}/30</strong>
            </div>
          </div>
        </div>
        <div className="detail-chart">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={scoreChartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis domain={[0, 40]} />

              <Tooltip />

              <Bar dataKey="value" name="Score" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =====================================================
                            ANOMALY DETECTION
      ===================================================== */}

      {isAnomaly && (
        <div className="detail-panel anomaly-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">DATA QUALITY</p>

              <h2>⚠️ Anomaly Detected</h2>
            </div>
          </div>

          <div className="anomaly-content">
            <strong>Dữ liệu video này có dấu hiệu bất thường.</strong>

            <p>
              Engagement hoặc follower conversion cao hơn đáng kể so với mức
              thông thường. Hãy kiểm tra xem đây có phải dữ liệu test hoặc dữ
              liệu nhập sai hay không.
            </p>

            {/* REASONS FROM BACKEND */}

            {anomalyReasons.length > 0 && (
              <div className="anomaly-reasons">
                <strong>Chi tiết:</strong>

                <ul>
                  {anomalyReasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
                             AI ANALYSIS
      ===================================================== */}

      <div className="detail-panel ai-analysis-page">
        <div className="panel-title">
          <div>
            <p className="eyebrow">AI ANALYSIS</p>

            <h2>What should you do next?</h2>
          </div>

          <span className="ai-icon">🤖</span>
        </div>

        <div className="analysis-list">
          {aiAnalysis.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>

              <h3>No AI analysis</h3>

              <p>Backend chưa trả về phân tích.</p>
            </div>
          ) : (
            aiAnalysis.map((analysis, index) => (
              <div className="analysis-item" key={index}>
                <span>{index + 1}</span>

                <p>{analysis}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

/* =========================================================
                           MAIN APP
========================================================= */

function App() {
  const [dashboard, setDashboard] = useState(null);

  const [insights, setInsights] = useState(null);

  const [videos, setVideos] = useState([]);

  const [videoUrl, setVideoUrl] = useState("");

  const [error, setError] = useState(null);

  const [activePage, setActivePage] = useState("dashboard");

  const [videoSearch, setVideoSearch] = useState("");

  const [videoSort, setVideoSort] = useState("views");

  const [engagementFilter, setEngagementFilter] = useState("all");

  const [selectedVideo, setSelectedVideo] = useState(null);
  // AI data
  const aiSummary = dashboard?.ai_summary || {};
  const insightAiSummary = insights?.ai_summary || {};

  /* =======================================================
                         LOAD API DATA
  ======================================================= */
  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }
        return res.json();
      }),

      fetch(`${import.meta.env.VITE_API_URL}/api/insights/`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load insights");
        }
        return res.json();
      }),

      fetch(`${import.meta.env.VITE_API_URL}/api/videos/`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load videos");
        }
        return res.json();
      }),
    ])
      .then(([dashboardData, insightsData, videosData]) => {
        setDashboard(dashboardData);
        setInsights(insightsData);

        if (Array.isArray(videosData)) {
          setVideos(videosData);
        } else if (Array.isArray(videosData.results)) {
          setVideos(videosData.results);
        } else {
          setVideos([]);
        }

        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  /* =======================================================
                              ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Không thể tải Dashboard</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  /* =======================================================
                        LOADING
  ======================================================= */

  if (!dashboard || !insights) {
    return (
      <div className="app">
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  /* =======================================================
                      ACCOUNT DATA
  ======================================================= */

  const account = dashboard.account || {};

  const summary = dashboard.summary || {};

  const insightSummary = insights.summary || {};

  const performance = insights.performance || {};

  const topVideos = Array.isArray(dashboard.top_videos)
    ? dashboard.top_videos
    : [];

  /* =======================================================
                         FILTER VIDEOS
  ======================================================= */

  const filteredVideos = [...videos]

    .filter((video) => {
      const search = videoSearch.toLowerCase().trim();

      if (!search) {
        return true;
      }

      return (
        video?.title?.toLowerCase().includes(search) ||
        video?.video_id?.toLowerCase().includes(search)
      );
    })

    .filter((video) => {
      if (engagementFilter === "all") {
        return true;
      }

      const engagement = Number(video?.engagement || 0);

      if (engagementFilter === "high") {
        return engagement >= 10;
      }

      if (engagementFilter === "medium") {
        return engagement >= 5 && engagement < 10;
      }

      if (engagementFilter === "low") {
        return engagement < 5;
      }

      return true;
    })

    .sort((a, b) => {
      if (videoSort === "views") {
        return Number(b?.views || 0) - Number(a?.views || 0);
      }

      if (videoSort === "engagement") {
        return Number(b?.engagement || 0) - Number(a?.engagement || 0);
      }

      if (videoSort === "conversion") {
        return (
          Number(b?.follower_conversion || 0) -
          Number(a?.follower_conversion || 0)
        );
      }

      return 0;
    });

  /* =======================================================
                        NAVIGATION
  ======================================================= */

  const handlePageChange = (page) => {
    setActivePage(page);

    setSelectedVideo(null);
  };

  /* =======================================================
                          RENDER
  ======================================================= */

  return (
    <div className="app">
      {/* ===================================================
                         SIDEBAR
      =================================================== */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">T</div>

          <div className="logo-text">
            <strong>TikTok Tool</strong>

            <span>Analytics</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* DASHBOARD */}

          <button
            className={
              activePage === "dashboard" ? "nav-item active" : "nav-item"
            }
            onClick={() => handlePageChange("dashboard")}
          >
            <span>📊</span>

            <span>Dashboard</span>
          </button>

          {/* VIDEOS */}

          <button
            className={activePage === "videos" ? "nav-item active" : "nav-item"}
            onClick={() => handlePageChange("videos")}
          >
            <span>🎬</span>

            <span>Videos</span>
          </button>

          {/* INSIGHTS */}

          <button
            className={
              activePage === "insights" ? "nav-item active" : "nav-item"
            }
            onClick={() => handlePageChange("insights")}
          >
            <span>💡</span>

            <span>Insights</span>
          </button>

          {/* SETTINGS */}

          <button
            className={
              activePage === "settings" ? "nav-item active" : "nav-item"
            }
            onClick={() => handlePageChange("settings")}
          >
            <span>⚙️</span>

            <span>Settings</span>
          </button>
        </nav>

        {/* SIDEBAR ACCOUNT */}

        <div className="sidebar-account">
          <span className="sidebar-avatar">
            {account.username?.charAt(0).toUpperCase() || "T"}
          </span>

          <div>
            <strong>@{account.username || "account"}</strong>

            <span>● Connected</span>
          </div>
        </div>
      </aside>

      {/* ===================================================
                                CONTENT
          =================================================== */}

      <div className="content">
        {/* =================================================
                            HEADER
          ================================================= */}
        <header className="header">
          <div>
            <p className="eyebrow">TIKTOK ANALYTICS</p>
            <h1>
              {activePage === "dashboard" && "Growth Dashboard"}
              {activePage === "videos" &&
                (selectedVideo ? "Video Detail" : "Videos")}
              {activePage === "insights" && "Insights"}
              {activePage === "settings" && "Settings"}
            </h1>
            <p className="subtitle">
              {activePage === "dashboard" &&
                "Phân tích hiệu suất nội dung TikTok"}
              {activePage === "videos" &&
                (selectedVideo
                  ? "Phân tích chi tiết hiệu suất video"
                  : "Theo dõi và phân tích các video TikTok")}
              {activePage === "insights" &&
                "AI phân tích và đề xuất chiến lược tăng trưởng"}
              {activePage === "settings" &&
                "Quản lý tài khoản và cấu hình công cụ"}
            </p>
          </div>
          {/* ACCOUNT BADGE */}
          <div className="account-badge">
            <span className="avatar">
              {account.username?.charAt(0).toUpperCase() || "T"}
            </span>
            <div>
              <strong>@{account.username || "account"}</strong>
              <span>{formatNumber(account.followers)} followers</span>
            </div>
          </div>
        </header>

        {/* =================================================
                                    DASHBOARD
        ================================================= */}

        {activePage === "dashboard" && (
          <main>
            {/* IMPORT TIKTOK VIDEO */}

            <section className="import-video-section">
              <input
                type="text"
                placeholder="Paste TikTok video URL..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />

              <button
                onClick={async () => {
                  if (!videoUrl.trim()) return;

                  const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/videos/import/`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        video_url: videoUrl,
                      }),
                    },
                  );

                  const data = await response.json();

                  setVideoUrl("");
                  setVideos((prev) => [data.video, ...prev]);
                }}
              >
                Import Video
              </button>
            </section>

            {/* STATS */}

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Followers</span>
                <strong>{formatNumber(account.followers)}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Views</span>
                <strong>
                  {formatNumber(
                    summary.total_views ?? insightSummary.total_video_views,
                  )}
                </strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Videos</span>
                <strong>
                  {formatNumber(
                    summary.total_videos ??
                      summary.video_count ??
                      insightSummary.video_count ??
                      videos.length,
                  )}
                </strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Likes</span>
                <strong>{formatNumber(summary.total_likes)}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Comments</span>
                <strong>{formatNumber(summary.total_comments)}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Shares</span>
                <strong>{formatNumber(summary.total_shares)}</strong>
              </div>
            </section>
            {/* ADVANCED PERFORMANCE */}
            <section className="section">
              {/* =================================================
                             AI ACCOUNT HEALTH
              ================================================= */}

              <section className="section ai-health-section">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">AI ANALYSIS</p>
                    <h2>AI Account Health</h2>
                    <p className="section-subtitle">
                      AI đánh giá tổng thể hiệu suất tài khoản dựa trên dữ liệu
                      video.
                    </p>
                  </div>
                  <div className="ai-health-score">
                    <strong>{Number(aiSummary.average_ai_score || 0)}</strong>
                    <span>/100</span>
                  </div>
                </div>
                <div className="ai-health-grid">
                  {/* ACCOUNT HEALTH */}
                  <div className="ai-health-card">
                    <span className="ai-card-label">ACCOUNT HEALTH</span>
                    <strong>{insightAiSummary.account_health || "N/A"}</strong>
                    <small>Overall account performance</small>
                  </div>

                  {/* VIRAL VIDEOS */}
                  <div className="ai-health-card">
                    <span className="ai-card-label">VIRAL VIDEOS</span>
                    <strong>{Number(aiSummary.viral_videos || 0)}</strong>
                    <small>AI Score ≥ 70</small>
                  </div>

                  {/* ANOMALIES */}
                  <div className="ai-health-card">
                    <span className="ai-card-label">ANOMALIES</span>
                    <strong>{Number(aiSummary.anomaly_videos || 0)}</strong>
                    <small>Videos cần kiểm tra</small>
                  </div>

                  {/* HIGH ENGAGEMENT */}
                  <div className="ai-health-card">
                    <span className="ai-card-label">HIGH ENGAGEMENT</span>
                    <strong>
                      {Number(insightAiSummary.high_engagement_videos || 0)}
                    </strong>
                    <small>Engagement ≥ 10%</small>
                  </div>

                  {/* HIGH CONVERSION */}
                  <div className="ai-health-card">
                    <span className="ai-card-label">HIGH CONVERSION</span>
                    <strong>
                      {Number(insightAiSummary.high_conversion_videos || 0)}
                    </strong>
                    <small>Conversion ≥ 2%</small>
                  </div>
                </div>

                {/* AI CONTENT STRATEGY */}
                {insightAiSummary.content_strategy && (
                  <div className="ai-strategy-box">
                    <div className="ai-strategy-title">
                      🤖 AI CONTENT STRATEGY
                    </div>
                    <p>{insightAiSummary.content_strategy}</p>
                  </div>
                )}
              </section>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">INSIGHTS</p>
                  <h2>Advanced Performance</h2>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Average Views</span>
                  <strong>{formatNumber(insightSummary.average_views)}</strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Engagement Rate</span>

                  <strong>
                    {formatPercent(insightSummary.engagement_rate)}%
                  </strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Follower Conversion</span>
                  <strong>
                    {formatPercent(insightSummary.follower_conversion_rate)}%
                  </strong>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Followers Gained</span>
                  <strong>
                    +{formatNumber(insightSummary.total_followers_gained)}
                  </strong>
                </div>
              </div>
            </section>

            {/* VIEWS CHART */}
            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">ANALYTICS</p>
                  <h2>Views Performance</h2>
                </div>
              </div>
              <div className="chart-card">
                {topVideos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No video data</h3>
                    <p>Chưa có dữ liệu video.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={topVideos}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="title"
                        tick={{
                          fontSize: 12,
                        }}
                        tickFormatter={(value) =>
                          value?.length > 16
                            ? `${value.slice(0, 16)}...`
                            : value
                        }
                      />
                      <YAxis
                        tick={{
                          fontSize: 12,
                        }}
                      />
                      <Tooltip />

                      <Bar dataKey="views" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* ENGAGEMENT CHART */}
            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">ANALYTICS</p>

                  <h2>Engagement Performance</h2>
                </div>
              </div>

              <div className="chart-card">
                {topVideos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📈</div>
                    <h3>No engagement data</h3>
                    <p>Chưa có dữ liệu engagement.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={topVideos}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="title"
                        tick={{
                          fontSize: 12,
                        }}
                        tickFormatter={(value) =>
                          value?.length > 16
                            ? `${value.slice(0, 16)}...`
                            : value
                        }
                      />
                      <YAxis
                        tick={{
                          fontSize: 12,
                        }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        name="Engagement %"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* BEST / WORST */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PERFORMANCE</p>

                  <h2>Best & Worst Video</h2>
                </div>
              </div>

              <div className="performance-grid">
                {/* BEST */}

                <div className="performance-card best">
                  <span className="performance-label">🏆 BEST VIDEO</span>

                  <h3>{getVideoTitle(performance.best_video)}</h3>

                  <div className="performance-metrics">
                    <span>
                      👀 {formatNumber(performance.best_video?.views)}
                    </span>

                    <span>
                      ❤️ {formatNumber(performance.best_video?.likes)}
                    </span>

                    <span>
                      💬 {formatNumber(performance.best_video?.comments)}
                    </span>

                    <span>
                      🔄 {formatNumber(performance.best_video?.shares)}
                    </span>

                    <span>
                      ➕{" "}
                      {formatNumber(performance.best_video?.followers_gained)}
                    </span>
                  </div>
                </div>

                {/* WORST */}

                <div className="performance-card worst">
                  <span className="performance-label">📉 WORST VIDEO</span>

                  <h3>{getVideoTitle(performance.worst_video)}</h3>

                  <div className="performance-metrics">
                    <span>
                      👀 {formatNumber(performance.worst_video?.views)}
                    </span>

                    <span>
                      ❤️ {formatNumber(performance.worst_video?.likes)}
                    </span>

                    <span>
                      💬 {formatNumber(performance.worst_video?.comments)}
                    </span>

                    <span>
                      🔄 {formatNumber(performance.worst_video?.shares)}
                    </span>

                    <span>
                      ➕{" "}
                      {formatNumber(performance.worst_video?.followers_gained)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* TOP VIDEOS */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PERFORMANCE</p>

                  <h2>Top Videos</h2>
                </div>

                <span className="video-count">{topVideos.length} videos</span>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <span>Video</span>
                  <span>Views</span>
                  <span>Engagement</span>
                  <span>Conversion</span>
                  <span>AI Score</span>
                  <span>Viral</span>
                  <span>Quality</span>
                  <span>AI Action</span>
                  <span>Status</span>
                </div>

                {topVideos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎬</div>

                    <h3>No videos</h3>

                    <p>Chưa có video nào.</p>
                  </div>
                ) : (
                  topVideos.map((video, index) => (
                    <div
                      className="video-row video-row-clickable"
                      key={video.video_id || `top-video-${index}`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="video-info">
                        <span className="rank">#{index + 1}</span>

                        <div>
                          <strong>{getVideoTitle(video)}</strong>

                          <small>ID: {video.video_id || "N/A"}</small>
                        </div>
                      </div>

                      <span>{formatNumber(video.views)}</span>

                      <span className="metric">
                        {formatPercent(video.engagement)}%
                      </span>

                      <span className="metric">
                        {formatPercent(video.follower_conversion)}%
                      </span>

                      <span
                        className={`status ${getStatusClass(
                          video.engagement_status,
                        )}`}
                      >
                        {video.engagement_status || "N/A"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* FOLLOWER GROWTH */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">GROWTH</p>

                  <h2>Follower Growth</h2>
                </div>
              </div>

              <div className="growth-card">
                <div>
                  <span className="stat-label">Followers gained</span>

                  <strong>
                    +
                    {formatNumber(
                      summary.total_followers_gained ??
                        insightSummary.total_followers_gained,
                    )}
                  </strong>
                </div>

                <div className="growth-description">
                  Tổng số follower mới đến từ các video được phân tích.
                </div>
              </div>
            </section>

            {/* RECOMMENDATIONS */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI ANALYSIS</p>

                  <h2>Growth Recommendations</h2>
                </div>
              </div>

              <div className="recommendations">
                {(insights.recommendations || []).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💡</div>

                    <h3>No recommendations</h3>

                    <p>Chưa có đề xuất.</p>
                  </div>
                ) : (
                  insights.recommendations.map((recommendation, index) => (
                    <div className="recommendation-card" key={index}>
                      <span className="recommendation-number">{index + 1}</span>

                      <p>{recommendation}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
            <section className="section ai-action-center">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI RECOMMENDATIONS</p>
                  <h2>AI Action Center</h2>
                  <p className="section-subtitle">
                    Những hành động AI đề xuất để cải thiện hiệu suất nội dung.
                  </p>
                </div>
              </div>

              <div className="ai-action-grid">
                {[
                  {
                    key: "scale",
                    label: "SCALE",
                    title: "Scale this content",
                    description:
                      "Nội dung đang hoạt động tốt. Hãy tạo thêm video cùng format.",
                  },
                  {
                    key: "improve-cta",
                    label: "IMPROVE CTA",
                    title: "Improve CTA",
                    description:
                      "Nội dung tốt nhưng cần CTA mạnh hơn để tăng follower.",
                  },
                  {
                    key: "fix-hook",
                    label: "FIX HOOK",
                    title: "Fix Hook",
                    description:
                      "Cải thiện hook và retention để giữ người xem lâu hơn.",
                  },
                  {
                    key: "test-hook",
                    label: "TEST HOOK",
                    title: "Test stronger Hook",
                    description:
                      "Thử một hook mạnh hơn để cải thiện hiệu suất video.",
                  },
                ].map((action) => {
                  const actionVideos = videos.filter((video) => {
                    const opportunityKey = video?.growth_opportunity?.key;

                    if (action.key === "scale") {
                      return opportunityKey === "scale";
                    }

                    if (action.key === "improve-cta") {
                      return opportunityKey === "improve-cta";
                    }

                    if (action.key === "fix-hook") {
                      return opportunityKey === "fix-hook";
                    }

                    if (action.key === "test-hook") {
                      return opportunityKey === "test-hook";
                    }

                    return false;
                  });

                  return (
                    <div
                      className={`ai-action-center-card ${action.key}`}
                      key={action.key}
                    >
                      <div className="ai-action-center-top">
                        <span className={`ai-action-badge ${action.key}`}>
                          {action.label}
                        </span>

                        <strong>{actionVideos.length}</strong>
                      </div>

                      <h3>{action.title}</h3>

                      <p>{action.description}</p>

                      {actionVideos.length > 0 && (
                        <div className="ai-action-video-list">
                          {actionVideos.slice(0, 3).map((video) => (
                            <button
                              key={video.video_id}
                              className="ai-action-video"
                              onClick={() => {
                                setSelectedVideo(video);
                                setActivePage("videos");
                              }}
                            >
                              <span>{getVideoTitle(video)}</span>

                              <strong>{Number(video.ai_score || 0)}</strong>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        )}

        {/* =================================================
                           VIDEOS DETAIL
        ================================================= */}

        {activePage === "videos" && selectedVideo && (
          <VideoDetailPage
            video={selectedVideo}
            onBack={() => setSelectedVideo(null)}
          />
        )}

        {/* =================================================
                           VIDEOS LIST
        ================================================= */}

        {activePage === "videos" && !selectedVideo && (
          <main>
            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">CONTENT</p>

                  <h2>All Videos</h2>
                </div>

                <span className="video-count">
                  {filteredVideos.length}
                  {" / "}
                  {videos.length} videos
                </span>
              </div>

              {/* CONTROLS */}

              <div className="video-controls">
                <div className="search-box">
                  <span>🔎</span>

                  <input
                    type="text"
                    placeholder="Search video..."
                    value={videoSearch}
                    onChange={(event) => setVideoSearch(event.target.value)}
                  />
                </div>

                <select
                  value={videoSort}
                  onChange={(event) => setVideoSort(event.target.value)}
                >
                  <option value="views">Sort: Views</option>

                  <option value="engagement">Sort: Engagement</option>

                  <option value="conversion">Sort: Conversion</option>
                </select>

                <select
                  value={engagementFilter}
                  onChange={(event) => setEngagementFilter(event.target.value)}
                >
                  <option value="all">All Engagement</option>

                  <option value="high">High ≥ 10%</option>

                  <option value="medium">Medium 5–10%</option>

                  <option value="low">Low &lt; 5%</option>
                </select>
              </div>

              {/* VIDEO TABLE */}

              <div className="table-card">
                <div className="table-header">
                  <span>Video</span>
                  <span>Views</span>
                  <span>Engagement</span>
                  <span>Conversion</span>
                  <span>AI Score</span>
                  <span>Viral</span>
                  <span>Quality</span>
                  <span>Status</span>
                </div>

                {filteredVideos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>

                    <h3>No videos found</h3>

                    <p>Thử thay đổi từ khóa hoặc bộ lọc.</p>
                  </div>
                ) : (
                  filteredVideos.map((video, index) => (
                    <div
                      className="video-row video-row-clickable"
                      key={video.video_id || `video-${index}`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      {/* VIDEO */}

                      <div className="video-info">
                        <span className="rank">#{index + 1}</span>

                        <div>
                          <strong>{getVideoTitle(video)}</strong>

                          <small>ID: {video.video_id || "N/A"}</small>
                        </div>
                      </div>

                      {/* VIEWS */}

                      <span>{formatNumber(video.views)}</span>

                      {/* ENGAGEMENT */}

                      <span className="metric">
                        {formatPercent(video.engagement)}%
                      </span>

                      {/* CONVERSION */}

                      <span className="metric">
                        {formatPercent(video.follower_conversion)}%
                      </span>

                      {/* AI SCORE */}

                      <span>
                        <strong className="video-ai-score">
                          {Number(video?.ai_score || 0)}
                        </strong>
                      </span>

                      {/* VIRAL */}

                      <span>
                        <span
                          className={`ai-badge ${
                            video?.viral_potential
                              ? video.viral_potential
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                              : ""
                          }`}
                        >
                          {video?.viral_potential || "N/A"}
                        </span>
                      </span>

                      {/* QUALITY */}

                      <span>
                        <span
                          className={`ai-badge ${
                            video?.content_quality
                              ? video.content_quality
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                              : ""
                          }`}
                        >
                          {video?.content_quality || "N/A"}
                        </span>
                      </span>

                      {/* AI ACTION */}

                      <span>
                        <span
                          className={`ai-action-badge ${
                            video?.growth_opportunity?.key || ""
                          }`}
                        >
                          {video?.growth_opportunity?.label || "N/A"}
                        </span>
                      </span>

                      {/* STATUS */}
                      <span
                        className={`status ${getStatusClass(
                          video.engagement_status,
                        )}`}
                      >
                        {video.engagement_status || "N/A"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        )}

        {/* =================================================
                                INSIGHTS
            ================================================= */}

        {activePage === "insights" && (
          <main>
            {/* =================================================
                             AI ACCOUNT OVERVIEW
             ================================================= */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI ANALYSIS</p>

                  <h2>Account Intelligence</h2>

                  <p className="section-subtitle">
                    Phân tích tổng thể và cơ hội tăng trưởng được tạo từ dữ liệu
                    video.
                  </p>
                </div>
              </div>

              <div className="insights-health-card">
                {/* SCORE */}

                <div className="insights-score">
                  <span>AI ACCOUNT SCORE</span>

                  <strong>
                    {Number(insightAiSummary.average_ai_score || 0)}
                  </strong>

                  <small>/100</small>
                </div>

                {/* HEALTH */}

                <div className="insights-health-info">
                  <span className="stat-label">ACCOUNT HEALTH</span>

                  <h3>{insightAiSummary.account_health || "N/A"}</h3>

                  <p>
                    AI đánh giá dựa trên engagement, follower conversion, views
                    và chất lượng nội dung.
                  </p>
                </div>

                {/* VIRAL */}

                <div className="insights-health-stat">
                  <span className="stat-label">VIRAL VIDEOS</span>

                  <strong>{Number(insightAiSummary.viral_videos || 0)}</strong>

                  <small>Score ≥ 70</small>
                </div>

                {/* ANOMALIES */}

                <div className="insights-health-stat">
                  <span className="stat-label">ANOMALIES</span>

                  <strong>
                    {Number(insightAiSummary.anomaly_videos || 0)}
                  </strong>

                  <small>Cần kiểm tra</small>
                </div>
              </div>
            </section>

            {/* =================================================
                              PERFORMANCE SUMMARY
            ================================================= */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PERFORMANCE</p>

                  <h2>Performance Summary</h2>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Average Views</span>

                  <strong>{formatNumber(insightSummary.average_views)}</strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">Engagement Rate</span>

                  <strong>
                    {formatPercent(insightSummary.engagement_rate)}%
                  </strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">Follower Conversion</span>

                  <strong>
                    {formatPercent(insightSummary.follower_conversion_rate)}%
                  </strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">Followers Gained</span>

                  <strong>
                    +{formatNumber(insightSummary.total_followers_gained)}
                  </strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">High Engagement</span>

                  <strong>
                    {Number(insightAiSummary.high_engagement_videos || 0)}
                  </strong>
                </div>

                <div className="stat-card">
                  <span className="stat-label">High Conversion</span>

                  <strong>
                    {Number(insightAiSummary.high_conversion_videos || 0)}
                  </strong>
                </div>
              </div>
            </section>

            {/* =================================================
                             CONTENT STRATEGY
            ================================================= */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI STRATEGY</p>

                  <h2>Content Strategy</h2>
                </div>

                <span className="ai-icon">🤖</span>
              </div>

              <div className="ai-strategy-box insights-strategy">
                <div className="ai-strategy-title">🤖 AI RECOMMENDATION</div>

                <p>
                  {insightAiSummary.content_strategy ||
                    "Chưa có chiến lược được tạo."}
                </p>
              </div>
            </section>

            {/* =================================================
                             AI RECOMMENDATIONS
            ================================================= */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI ANALYSIS</p>

                  <h2>Growth Recommendations</h2>
                </div>
              </div>

              <div className="recommendations">
                {(insights.recommendations || []).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💡</div>

                    <h3>No recommendations</h3>

                    <p>Chưa có đề xuất.</p>
                  </div>
                ) : (
                  insights.recommendations.map((recommendation, index) => (
                    <div className="recommendation-card" key={index}>
                      <span className="recommendation-number">{index + 1}</span>

                      <div>
                        <span className="recommendation-label">AI ACTION</span>

                        <p>{recommendation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* =================================================
                              BEST / WORST
              ================================================= */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI PERFORMANCE</p>

                  <h2>Best & Worst Content</h2>
                </div>
              </div>

              <div className="performance-grid">
                {/* BEST */}

                <div
                  className="performance-card best performance-card-clickable"
                  onClick={() => {
                    if (performance.best_video?.video_id) {
                      setSelectedVideo(performance.best_video);

                      setActivePage("videos");
                    }
                  }}
                >
                  <span className="performance-label">🏆 BEST VIDEO</span>

                  <h3>{getVideoTitle(performance.best_video)}</h3>

                  <div className="performance-metrics">
                    <span>
                      👀 {formatNumber(performance.best_video?.views)}
                    </span>

                    <span>
                      ❤️ {formatNumber(performance.best_video?.likes)}
                    </span>

                    <span>
                      📈 {formatPercent(performance.best_video?.engagement)}%
                    </span>

                    <span>
                      👤 +{" "}
                      {formatNumber(performance.best_video?.followers_gained)}
                    </span>
                  </div>

                  <div className="best-video-score">
                    AI Score:{" "}
                    <strong>
                      {Number(performance.best_video?.ai_score || 0)}
                      /100
                    </strong>
                  </div>
                </div>

                {/* WORST */}

                <div
                  className="performance-card worst performance-card-clickable"
                  onClick={() => {
                    if (performance.worst_video?.video_id) {
                      setSelectedVideo(performance.worst_video);

                      setActivePage("videos");
                    }
                  }}
                >
                  <span className="performance-label">
                    📉 NEEDS IMPROVEMENT
                  </span>

                  <h3>{getVideoTitle(performance.worst_video)}</h3>

                  <div className="performance-metrics">
                    <span>
                      👀 {formatNumber(performance.worst_video?.views)}
                    </span>

                    <span>
                      ❤️ {formatNumber(performance.worst_video?.likes)}
                    </span>

                    <span>
                      📈 {formatPercent(performance.worst_video?.engagement)}%
                    </span>

                    <span>
                      👤 +{" "}
                      {formatNumber(performance.worst_video?.followers_gained)}
                    </span>
                  </div>

                  <div className="best-video-score">
                    AI Score:{" "}
                    <strong>
                      {Number(performance.worst_video?.ai_score || 0)}
                      /100
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                              ANOMALIES
                ================================================= */}

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">DATA QUALITY</p>

                  <h2>Anomaly Detection</h2>
                </div>

                <span className="video-count">
                  {Number(insightAiSummary.anomaly_videos || 0)} detected
                </span>
              </div>

              {Array.isArray(insights.anomalies) &&
              insights.anomalies.length > 0 ? (
                <div className="anomaly-list">
                  {insights.anomalies.map((item, index) => {
                    const anomalyVideo = item?.video || {};

                    const reasons = Array.isArray(item?.reasons)
                      ? item.reasons
                      : [];

                    return (
                      <div
                        className="anomaly-card"
                        key={anomalyVideo.video_id || index}
                      >
                        <div className="anomaly-card-header">
                          <div>
                            <span className="performance-label">
                              ⚠️ ANOMALY
                            </span>

                            <h3>{getVideoTitle(anomalyVideo)}</h3>

                            <small>ID: {anomalyVideo.video_id || "N/A"}</small>
                          </div>

                          <strong>
                            AI Score {Number(anomalyVideo.ai_score || 0)}
                          </strong>
                        </div>

                        <div className="anomaly-metrics">
                          <span>
                            👀 {formatNumber(anomalyVideo.views)} views
                          </span>

                          <span>
                            📈 {formatPercent(anomalyVideo.engagement)}%
                            engagement
                          </span>

                          <span>
                            👤 {formatPercent(anomalyVideo.follower_conversion)}
                            % conversion
                          </span>
                        </div>

                        {reasons.length > 0 && (
                          <ul className="anomaly-reasons">
                            {reasons.map((reason, reasonIndex) => (
                              <li key={reasonIndex}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✅</div>

                  <h3>No anomalies detected</h3>

                  <p>Dữ liệu video hiện tại không có dấu hiệu bất thường.</p>
                </div>
              )}
            </section>
          </main>
        )}

        {/* =================================================
                               SETTINGS
        ================================================= */}

        {activePage === "settings" && (
          <main>
            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">SETTINGS</p>

                  <h2>Account</h2>
                </div>
              </div>

              <div className="settings-card">
                <div className="settings-row">
                  <div>
                    <span className="stat-label">TikTok Username</span>

                    <strong>@{account.username || "account"}</strong>
                  </div>

                  <span className="connected-badge">● Connected</span>
                </div>

                <div className="settings-row">
                  <div>
                    <span className="stat-label">Followers</span>

                    <strong>{formatNumber(account.followers)}</strong>
                  </div>
                </div>
                <div className="settings-row">
                  <div>
                    <span className="stat-label">Following</span>

                    <strong>{formatNumber(account.following)}</strong>
                  </div>
                </div>
                <div className="settings-row">
                  <div>
                    <span className="stat-label">Total Views</span>

                    <strong>
                      {formatNumber(
                        account.total_views ??
                          summary.total_views ??
                          insightSummary.total_video_views,
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;

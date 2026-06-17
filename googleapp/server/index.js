import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const NAVER_NEWS_API_URL = "https://openapi.naver.com/v1/search/news.json";

app.use(cors({ origin: "http://localhost:5173" }));

const decodeHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getSourceFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname || "네이버 뉴스";
  } catch {
    return "네이버 뉴스";
  }
};

app.get("/api/news", async (req, res) => {
  const query = String(req.query.query || "").trim();

  if (!query) {
    return res.status(400).json({ message: "검색어가 필요합니다." });
  }

  if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
    return res.status(500).json({ message: "네이버 API 환경변수가 설정되지 않았습니다." });
  }

  const params = new URLSearchParams({
    query,
    display: "5",
    sort: "date",
  });

  try {
    const response = await fetch(`${NAVER_NEWS_API_URL}?${params}`, {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Naver News API error:", response.status, errorText);
      return res.status(response.status).json({ message: "네이버 뉴스 API 요청에 실패했습니다." });
    }

    const data = await response.json();
    const articles = Array.isArray(data.items) ? data.items : [];

    return res.json({
      articles: articles.map((article) => {
        const url = article.originallink || article.link;
        const source = getSourceFromUrl(url);
        const date = formatDate(article.pubDate);

        return {
          title: decodeHtml(article.title),
          summary: date ? `${source} · ${date}` : source,
          source,
          url,
        };
      }),
    });
  } catch (error) {
    console.error("News proxy error:", error);
    return res.status(500).json({ message: "뉴스를 불러오지 못했습니다." });
  }
});

app.listen(port, () => {
  console.log(`News proxy server listening on http://localhost:${port}`);
});

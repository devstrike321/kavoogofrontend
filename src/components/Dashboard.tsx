import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { getToken } from "../utils/auth";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const token = useSelector((state: RootState) => state.auth.token);
  const [analytics, setAnalytics] = useState<any>({
    userEngagement: [],
    activeCampaigns: 0,
    completions: [],
    totalPartner: 0,
    userGrowth: [],
    // campaignPerformance: { typeA: 50, typeB: 30, typeC: 20 },
    // rewardDistribution: { providerX: 40, providerY: 35, providerZ: 25 },
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/analytics");
        // Merge to avoid overwriting with undefined fields
        setAnalytics((prev: any) => ({ ...prev, ...res.data }));
      } catch (err: any) {
        if (err.status == 401) {
          dispatch(logout());
        }
        console.error(err);
        navigate("/login");
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/api/transactions", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  let totalCash = 0;

  transactions.map((tx) => {
    totalCash += tx.campaign[0]?.rewardAmount || 0;
  });

  useEffect(() => {
  // Draw user growth line chart
  const userCtx = document.getElementById(
    "userGrowthChart"
  ) as HTMLCanvasElement;
  if (userCtx) {
    const ctx = userCtx.getContext("2d");
    if (ctx) {
      const width = userCtx.width;
      const height = userCtx.height;

      ctx.clearRect(0, 0, width, height);

      const data = analytics.userGrowth || [];
      const counts = Array.from({ length: 30 }, () => 0);
      data.forEach((item: { _id: number; count: number }) => {
        const index = item._id - 1;
        if (index >= 0 && index < 30) {
          counts[index] = item.count;
        }
      });

      const maxCount = Math.max(...counts, 1); // Avoid division by zero

      const leftPadding = 40;
      const bottomPadding = 20;
      const topPadding = 10;
      const rightPadding = 10;

      const graphWidth = width - leftPadding - rightPadding;
      const graphHeight = height - topPadding - bottomPadding;

      const xStep = graphWidth / 29; // 30 days, 29 intervals
      const yScale = graphHeight / maxCount;

      const originX = leftPadding;
      const originY = height - bottomPadding;
      const topY = topPadding;

      // Draw axes
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;

      // X-axis
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + graphWidth, originY);
      ctx.stroke();

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, topY);
      ctx.stroke();

      // X-axis labels (days 1 to 30, every 5 days)
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      for (let day = 0; day <= 30; day += 5) {
        const i = day - 1 < 0 ? 0 : day - 1;
        const x = originX + i * xStep;
        ctx.fillText("Day" + (i+1).toString(), x, originY + 15);
      ctx.textAlign = "right";
      }

      // Y-axis labels (counts from 0 to maxCount)
      ctx.textAlign = "right";
      // const yStepValue = Math.max(1, Math.ceil(maxCount / 5));
      // for (let v = 0; v <= maxCount; v += yStepValue) {
      //   const y = originY - v * yScale;
      //   ctx.fillText(v.toString(), originX - 5, y + 3);
      // }

      // Prepare points
      const points = [];
      for (let i = 0; i < 30; i++) {
        points.push({
          x: originX + i * xStep,
          y: originY - counts[i] * yScale,
        });
      }

      // Clip to the graph area to prevent curve from going below x-axis
      ctx.save();
      ctx.beginPath();
      ctx.rect(originX, topY, graphWidth, graphHeight);
      ctx.clip();

      // Draw the smooth curve using Catmull-Rom spline approximated with Bezier curves
      ctx.beginPath();
      ctx.strokeStyle = "#F5A623";
      ctx.lineWidth = 2;

      if (points.length >= 2) {
        ctx.moveTo(points[0].x, points[0].y);

        // First segment
        const pMinus1x = 2 * points[0].x - points[1].x;
        const pMinus1y = 2 * points[0].y - points[1].y;
        let cp1x = points[0].x + (points[1].x - pMinus1x) / 6;
        let cp1y = points[0].y + (points[1].y - pMinus1y) / 6;
        let cp2x = points[1].x + (points[0].x - points[2].x) / 6;
        let cp2y = points[1].y + (points[0].y - points[2].y) / 6;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[1].x, points[1].y);

        // Middle segments
        for (let i = 1; i < points.length - 2; i++) {
          cp1x = points[i].x + (points[i + 1].x - points[i - 1].x) / 6;
          cp1y = points[i].y + (points[i + 1].y - points[i - 1].y) / 6;
          cp2x = points[i + 1].x + (points[i].x - points[i + 2].x) / 6;
          cp2y = points[i + 1].y + (points[i].y - points[i + 2].y) / 6;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i + 1].x, points[i + 1].y);
        }

        // Last segment
        const last = points.length - 1;
        const pPlus1x = 2 * points[last].x - points[last - 1].x;
        const pPlus1y = 2 * points[last].y - points[last - 1].y;
        cp1x = points[last - 1].x + (points[last].x - points[last - 2].x) / 6;
        cp1y = points[last - 1].y + (points[last].y - points[last - 2].y) / 6;
        cp2x = points[last].x + (points[last - 1].x - pPlus1x) / 6;
        cp2y = points[last].y + (points[last - 1].y - pPlus1y) / 6;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[last].x, points[last].y);
      }

      ctx.stroke();

      ctx.restore();
    }
  }
}, [analytics.userGrowth]); // Re-run when userGrowth changes


useEffect(() => {
  // Draw content type horizontal bar chart
  const ctxElement = document.getElementById(
    "campaignPerformanceChart"
  ) as HTMLCanvasElement;
  if (ctxElement) {
    const ctx = ctxElement.getContext("2d");
    if (ctx) {
      const width = ctxElement.width;
      const height = ctxElement.height;

      ctx.clearRect(0, 0, width, height);

      const data = analytics.completions || []; // Assuming data is in analytics.contentTypes
      const categories = data.map((item: { _id: string; count: number }) => item._id);
      const counts = data.map((item: { _id: string; count: number }) => item.count);

      const numBars = categories.length;
      if (numBars === 0) return;

      const maxCount = Math.max(...counts, 1); // Avoid division by zero

      const leftPadding = 100; // Increased for category labels
      const bottomPadding = 30;
      const topPadding = 10;
      const rightPadding = 10;

      const graphWidth = width - leftPadding - rightPadding;
      const graphHeight = height - topPadding - bottomPadding;

      const barSpacing = graphHeight / numBars;
      const barHeight = barSpacing * 0.7; // 70% bar height, 30% spacing

      const originX = leftPadding;
      const originY = height - bottomPadding;

      // Draw axes
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;

      // X-axis (counts)
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + graphWidth, originY);
      ctx.stroke();

      // Y-axis (categories)
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, topPadding);
      ctx.stroke();

      // X-axis labels (counts from 0 to maxCount, every reasonable step)
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      // const xStepValue = Math.max(1, Math.ceil(maxCount / 5));
      // for (let v = 0; v <= maxCount; v += xStepValue) {
      //   const x = originX + v * (graphWidth / maxCount);
      //   ctx.fillText(v.toString(), x, originY + 15);
      // }

      // Y-axis labels (categories)
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let i = 0; i < numBars; i++) {
        const y = topPadding + i * barSpacing + barSpacing / 2;
        ctx.fillText(categories[i], originX - 5, y);
      }

      // Draw bars
      ctx.fillStyle = "#F5A623";
      for (let i = 0; i < numBars; i++) {
        const barWidth = counts[i] * (graphWidth / maxCount);
        const barY = topPadding + i * barSpacing + (barSpacing - barHeight) / 2;
        ctx.fillRect(originX, barY, barWidth, barHeight);
      }
    }
  }
}, [analytics.completions]);

  return (
    <div>
      <h1>{t("dashboard")}</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.userEngagement.length}</div>
          <div className="stat-label">{t("totalUsers")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.activeCampaigns}</div>
          <div className="stat-label">{t("activeCampaigns")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${totalCash}</div>
          <div className="stat-label">{t("rewardsDistributed")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totalPartner}</div>
          <div className="stat-label">{t("partners")}</div>
        </div>
      </div>
      <div className="section-title">{t("trends")}</div>
      <div className="chart-container">
        <h2>{t("userGrowth")}</h2>
        <canvas id="userGrowthChart" width="600" height="200"></canvas>
      </div>
      <div className="chart-container">
        <h2>{t("campaignPerformance")}</h2>
        <canvas id="campaignPerformanceChart" width="600" height="200"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;

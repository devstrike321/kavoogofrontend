import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const token = useSelector((state: RootState) => state.auth.token);
  const [analytics, setAnalytics] = useState<any>({
    totalUsers: 0,
    activeCampaigns: 0,
    rewardsDistributed: 0,
    partners: 0,
    userGrowth: [],
    // campaignPerformance: { typeA: 50, typeB: 30, typeC: 20 },
    // rewardDistribution: { providerX: 40, providerY: 35, providerZ: 25 },
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics');
        // Merge to avoid overwriting with undefined fields
        setAnalytics((prev: any) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    // Draw user growth line chart
    const userCtx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    if (userCtx) {
      const ctx = userCtx.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, userCtx.width, userCtx.height);
        ctx.beginPath();
        ctx.moveTo(0, 100); // Simulate design line
        // Draw based on data, with orange line
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#F5A623';
        // Safely handle if userGrowth is undefined
        (analytics.userGrowth || []).map((val: number, i: number) => {
          ctx.lineTo(i * 50, 100 - val);
        });
        ctx.stroke();
        // Add labels, etc.
      }
    }
  }, [analytics.userGrowth]); // Re-run when userGrowth changes

  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.totalUsers}</div>
          <div className="stat-label">{t('totalUsers')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.activeCampaigns}</div>
          <div className="stat-label">{t('activeCampaigns')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${analytics.rewardsDistributed}</div>
          <div className="stat-label">{t('rewardsDistributed')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.partners}</div>
          <div className="stat-label">{t('partners')}</div>
        </div>
      </div>
      <div className="section-title">{t('trends')}</div>
      <div className="chart-container">
        <h2>{t('userGrowth')}</h2>
        <canvas id="userGrowthChart" width="600" height="200"></canvas>
      </div>
      <div className="chart-container">
        <h2>{t('campaignPerformance')}</h2>
        <canvas id="campaignPerformanceChart" width="600" height="200"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
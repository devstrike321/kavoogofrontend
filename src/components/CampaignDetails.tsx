import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const CampaignDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>({ targetingData: {}, rewards: {}, budget: {} });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`/api/campaigns/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        setCampaign(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaign();
  }, [id]);

  return (
    <div>
      <h1>{t('campaignDetails')}</h1>
      <Link to={`/campaigns/edit/${id}`} className="primary" style={{ float: 'right' }}>{t('edit')}</Link>
      <div className="section-title">{t('campaignDetails')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('campaignName')}</span>
        <span className="detail-value">{campaign.name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('description')}</span>
        <span className="detail-value">{campaign.description}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('partner')}</span>
        <span className="detail-value">{campaign.partner}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('activityType')}</span>
        <span className="detail-value">{campaign.activityType}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('startDate')}</span>
        <span className="detail-value">{campaign.startDate}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('endDate')}</span>
        <span className="detail-value">{campaign.endDate}</span>
      </div>
      <div className="section-title">{t('userTargeting', { defaultValue: 'User Targeting' })}</div>
      <div className="detail-row">
        <span className="detail-label">{t('ageRange')}</span>
        <span className="detail-value">{campaign.targetingData.ageMin} - {campaign.targetingData.ageMax}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('country')}</span>
        <span className="detail-value">{campaign.targetingData.country}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('city')}</span>
        <span className="detail-value">{campaign.targetingData.city}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('employmentStatus')}</span>
        <span className="detail-value">{campaign.targetingData.employmentStatus}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('educationLevel')}</span>
        <span className="detail-value">{campaign.targetingData.educationLevel}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('salaryRange')}</span>
        <span className="detail-value">{campaign.targetingData.salaryMin} - {campaign.targetingData.salaryMax}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('maritalStatus')}</span>
        <span className="detail-value">{campaign.targetingData.maritalStatus}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('kidsNoKids')}</span>
        <span className="detail-value">{campaign.targetingData.kidsNoKids}</span>
      </div>
      <div className="section-title">{t('rewards')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('rewardType', { defaultValue: 'Reward Type' })}</span>
        <span className="detail-value">Cash</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('amount')}</span>
        <span className="detail-value">${campaign.rewards.amount}</span>
      </div>
      <div className="section-title">{t('budgetAndLimit', { defaultValue: 'Budget and Limit' })}</div>
      <div className="detail-row">
        <span className="detail-label">{t('totalBudget')}</span>
        <span className="detail-value">${campaign.budget.totalBudget}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('costPerUser')}</span>
        <span className="detail-value">${campaign.budget.costPerUser}</span>
      </div>
      <div className="section-title">{t('content')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('video')}</span>
        <span className="detail-value">{campaign.video || 'Video thumbnail'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('surveyLink')}</span>
        <span className="detail-value">{campaign.survey}</span>
      </div>
    </div>
  );
};

export default CampaignDetails;
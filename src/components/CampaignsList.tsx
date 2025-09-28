import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth';

const CampaignsList: React.FC = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/api/admins/campaigns', { headers: { Authorization: `Bearer ${getToken()}` } });
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h1>{t('campaigns')}</h1>
      <Link to="/create-campaign" className="primary" style={{ float: 'right' }}>{t('createNewCampaign', { defaultValue: 'Create New Campaign' })}</Link>
      <table className="table">
        <thead>
          <tr>
            <th>{t('title', { defaultValue: 'Title' })}</th>
            <th>{t('partner')}</th>
            <th>{t('status')}</th>
            <th>{t('activityType')}</th>
            <th>{t('startDate')}</th>
            <th>{t('endDate')}</th>
            <th>{t('creationDate', { defaultValue: 'Creation Date' })}</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(camp => (
            <tr key={camp._id}>
              <td><Link to={`/campaigns/${camp._id}`}>{camp.name}</Link></td>
              <td>{camp.partner || 'N/A'}</td>
              <td><span className={`status-badge status-${(camp.status?.toLowerCase() || 'unknown')}`}>{t(camp.status?.toLowerCase() || 'unknown')}</span></td>
              <td>{camp.activityType || 'N/A'}</td>
              <td>{camp.startDate || 'N/A'}</td>
              <td>{camp.endDate || 'N/A'}</td>
              <td>{camp.creationDate || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsList;
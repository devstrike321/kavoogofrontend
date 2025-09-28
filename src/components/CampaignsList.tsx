import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { useSelector } from "react-redux";
import { RootState } from "../store";

const CampaignsList: React.FC = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const role = useSelector((state: RootState) => state.auth.role);
  console.log(role);


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if(role !== 'adminUser' && role !== 'partner') return;
        if(role === 'partner'){
          const res = await axios.get('/api/partners/campaigns', { headers: { Authorization: `Bearer ${getToken()}` } });
          setCampaigns(res.data);
          return;
        }
        const res = await axios.get('/api/admins/campaigns', { headers: { Authorization: `Bearer ${getToken()}` } });
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaigns();
  }, []);

  console.log(campaigns);

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
              <td>{camp.partner[0]?.partnerName || ''}</td>
              <td><span className={`status-badge status-${(camp.status?.toLowerCase() || 'unknown')}`}>{t(camp.status?.toLowerCase() || 'unknown')}</span></td>
              <td>{camp.activityType || ''}</td>
              <td>{camp.startDate || ''}</td>
              <td>{camp.endDate || ''}</td>
              <td>{camp.creationDate || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsList;
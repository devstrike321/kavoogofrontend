import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { useSelector } from "react-redux";
import { RootState } from "../store";

const CampaignsList: React.FC = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const role = useSelector((state: RootState) => state.auth.role);
  console.log(role);

  const navigate = useNavigate();


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

  

  return (
    <div>
      <h1>{t('campaigns')}</h1>
      <button className="primary" style={{ float: 'right' }} onClick={()=>navigate("/create-campaign")} >{t('createNewCampaign', { defaultValue: 'Create New Campaign' })}</button>
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
              <td onClick={()=>navigate(`/campaigns/${camp._id}`)}>{camp.name}</td>
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
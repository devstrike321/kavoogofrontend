import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const PartnerDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<any>({ campaigns: [] });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await axios.get(`/api/admins/partners/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        setPartner(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartner();
  }, [id]);

  return (
    <div>
      <h1>{t('partnerDetails')}</h1>
      <Link to={`/partners/edit/${id}`} className="primary" style={{ float: 'right' }}>{t('edit')}</Link>
      <div className="section-title">{t('partnerInformation', { defaultValue: 'Partner Information' })}</div>
      <div className="detail-row">
        <span className="detail-label">{t('partnerName')}</span>
        <span className="detail-value">{partner.partnerName || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('country')}</span>
        <span className="detail-value">{partner.country || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('status')}</span>
        <span className="detail-value">{partner.status || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('contactPerson')}</span>
        <span className="detail-value">{partner.contactPerson || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('email')}</span>
        <span className="detail-value">{partner.email || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('phoneNumber')}</span>
        <span className="detail-value">{partner.phoneNumber || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('industry')}</span>
        <span className="detail-value">{partner.industry || 'N/A'}</span>
      </div>
      <div className="section-title">{t('associatedCampaigns', { defaultValue: 'Associated Campaigns' })}</div>
      <table className="table">
        <thead>
          <tr>
            <th>{t('campaignName')}</th>
            <th>{t('activityType')}</th>
            <th>{t('status')}</th>
            <th>{t('startDate')}</th>
            <th>{t('endDate')}</th>
          </tr>
        </thead>
        <tbody>
          {partner.campaigns.map((camp: any) => (
            <tr key={camp._id}>
              <td>{camp.name || 'N/A'}</td>
              <td>{camp.activityType || 'N/A'}</td>
              <td><span className={`status-badge status-${(camp.status?.toLowerCase() || 'unknown')}`}>{t(camp.status?.toLowerCase() || 'unknown')}</span></td>
              <td>{camp.startDate || 'N/A'}</td>
              <td>{camp.endDate || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerDetails;
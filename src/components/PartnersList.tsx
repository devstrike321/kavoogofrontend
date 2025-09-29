import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnersList: React.FC = () => {
  const { t } = useTranslation();
  const [partners, setPartners] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get('/api/admins/partners');
        setPartners(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartners();
  }, []);

  return (
    <div>
      <h1>{t('partners')}</h1>
      <button onClick={()=>navigate("/add-partner")} className="primary" style={{ float: 'right' }}>{t('addNewPartner', { defaultValue: 'Add New Partner' })}</button>
      <table className="table">
        <thead>
          <tr>
            <th>{t('partnerName', { defaultValue: 'Partner Name' })}</th>
            <th>{t('country')}</th>
            <th>{t('status')}</th>
            <th>{t('lastCampaign')}</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(partner => (
            <tr key={partner._id}>
              <td onClick={() => navigate(`/partners/${partner._id}`)}>{partner.partnerName}</td>
              <td>{partner.country}</td>
              <td><span className={`status-badge status-${partner.status.toLowerCase()}`}>{t(partner.status.toLowerCase())}</span></td>
              <td>{partner.lastCampaign || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnersList;
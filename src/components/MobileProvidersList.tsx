import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const MobileProvidersList: React.FC = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get('/api/providers', { headers: { Authorization: `Bearer ${getToken()}` } });
        setProviders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProviders();
  }, []);

  return (
    <div>
      <h1>{t('mobileProviders')}</h1>
      <button onClick={() => navigate("/add-mobile-provider")} className="primary" style={{ float: 'right' }}>{t('addNewProvider', { defaultValue: 'Add New Provider' })}</button>
      <table className="table">
        <thead>
          <tr>
            <th>{t('cashAmount', { defaultValue: 'Cash Amount' })}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(provider => (
            <tr key={provider._id}>
              <td>${provider.cashAmount}</td>
              <td onClick={() => navigate(`/add-mobile-providers/${provider._id}`)}>{t('edit', { defaultValue: 'edit' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MobileProvidersList;
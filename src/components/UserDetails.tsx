import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const UserDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>({ targetingData: {}, transactions: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admins/users/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div>
      <h1>{t('userDetails')}</h1>
      <button onClick={() => navigate(`/users/edit/${id}`)} className="primary" style={{ float: 'right' }}>{t('edit')}</button>
      <div className="section-title">{t('userProfileDetails')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('lastName', { defaultValue: 'Last Name' })}</span>
        <span className="detail-value">{user.lastName}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('firstName', { defaultValue: 'First Name' })}</span>
        <span className="detail-value">{user.firstName}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('phone')}</span>
        <span className="detail-value">{user.phone}</span>
      </div>
      <div className="section-title">{t('targetingData')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('dateOfBirth', { defaultValue: 'Date of Birth' })}</span>
        <span className="detail-value">{user.targetingData.dateOfBirth}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('country')}</span>
        <span className="detail-value">{user.targetingData.country}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('city')}</span>
        <span className="detail-value">{user.targetingData.city}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('employmentStatus')}</span>
        <span className="detail-value">{user.targetingData.employmentStatus}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('educationLevel')}</span>
        <span className="detail-value">{user.targetingData.educationLevel}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('salaryRange')}</span>
        <span className="detail-value">{user.targetingData.salaryRange}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('maritalStatus')}</span>
        <span className="detail-value">{user.targetingData.maritalStatus}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('kidsNoKids')}</span>
        <span className="detail-value">{user.targetingData.kidsNoKids}</span>
      </div>
      <div className="section-title">{t('rewards')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('cumulativeCash', { defaultValue: 'Cumulative Cash' })}</span>
        <span className="detail-value">${user.rewards}</span>
      </div>
      <div className="section-title">{t('transactionDetails')}</div>
      <table className="table">
        <thead>
          <tr>
            <th>{t('campaignName')}</th>
            <th>{t('activityType')}</th>
            <th>{t('partner')}</th>
            <th>{t('status')}</th>
            <th>{t('date')}</th>
          </tr>
        </thead>
        <tbody>
          {user.transactions.map((tx: any) => (
            <tr key={tx._id}>
              <td>{tx.campaignName}</td>
              <td>{tx.activityType}</td>
              <td>{tx.partner}</td>
              <td><span className={`status-badge status-${tx.status.toLowerCase()}`}>{t(tx.status.toLowerCase())}</span></td>
              <td>{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
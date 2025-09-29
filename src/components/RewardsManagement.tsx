import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const RewardsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<any>({ totalCash: 0, providers: [], transactions: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await axios.get('/api/rewards', { headers: { Authorization: `Bearer ${getToken()}` } }); // Assume endpoint
        setRewards(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRewards();
  }, []);

  return (
    <div>
      <h1>{t('rewards')}</h1>
      <button onClick={()=>"/add-reward"} className="primary" style={{ float: 'right' }}>{t('addNewReward', { defaultValue: 'Add New Reward' })}</button>
      <div className="section-title">{t('totalRewardsDistributed', { defaultValue: 'Total Rewards Distributed' })}</div>
      <div className="detail-row">
        <span className="detail-label">{t('totalCash')}</span>
        <span className="detail-value">${rewards.totalCash}</span>
      </div>
      <div className="section-title">{t('mobileProviders')}</div>
      <table className="table">
        <thead>
          <tr>
            <th>{t('provider')}</th>
            <th>{t('cashAmount')}</th>
          </tr>
        </thead>
        <tbody>
          {rewards.providers.map((prov: any) => (
            <tr key={prov._id}>
              <td>{prov.providerName}</td>
              <td>${prov.cashAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="section-title">{t('rewardTransactions', { defaultValue: 'Reward Transactions' })}</div>
      <table className="table">
        <thead>
          <tr>
            <th>{t('transactionId')}</th>
            <th>{t('date')}</th>
            <th>{t('type', { defaultValue: 'Type' })}</th>
            <th>{t('amount')}</th>
            <th>{t('status')}</th>
            <th>{t('campaign')}</th>
            <th>{t('partner')}</th>
            <th>{t('user')}</th>
          </tr>
        </thead>
        <tbody>
          {rewards.transactions.map((tx: any) => (
            <tr key={tx._id}>
              <td>{tx.id}</td>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>${tx.amount}</td>
              <td><span className={`status-badge status-${tx.status.toLowerCase()}`}>{t(tx.status.toLowerCase())}</span></td>
              <td>{tx.campaign}</td>
              <td>{tx.partner}</td>
              <td>{tx.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardsManagement;
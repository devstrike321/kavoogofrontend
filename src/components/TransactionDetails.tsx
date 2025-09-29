import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const TransactionDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [tx, setTx] = useState<any>({ participant: {} });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await axios.get(`/api/transactions/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        setTx(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTx();
  }, [id]);

  return (
    <div>
      <h1>{t('transactionDetails')}</h1>
      <div className="section-title">{t('transactionProfile', { defaultValue: 'Transaction Profile' })}</div>
      <div className="detail-row">
        <span className="detail-label">{t('transactionId')}</span>
        <span className="detail-value">{tx.id}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('date')}</span>
        <span className="detail-value">{tx.date}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('status')}</span>
        <span className="detail-value">{tx.status}</span>
      </div>
      <div className="section-title">{t('campaignDetails')}</div>
      <div className="detail-row">
        <span className="detail-label">{t('campaignName')}</span>
        <span className="detail-value">{tx.campaignName}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('activityType')}</span>
        <span className="detail-value">{tx.activityType}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('rewardType')}</span>
        <span className="detail-value">Cash</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('amount')}</span>
        <span className="detail-value">${tx.amount}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('partner')}</span>
        <span className="detail-value">{tx.partner}</span>
      </div>
      <div className="section-title">{t('participantDetails', { defaultValue: 'Participant Details' })}</div>
      <div className="detail-row">
        <span className="detail-label">{t('user')}</span>
        <span className="detail-value">{tx.participant.name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('phone')}</span>
        <span className="detail-value">{tx.participant.phone}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('country')}</span>
        <span className="detail-value">{tx.participant.country}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">{t('city')}</span>
        <span className="detail-value">{tx.participant.city}</span>
      </div>
      <button onClick={() => navigate("/transactions")} className="secondary">{t('back')}</button>
    </div>
  );
};

export default TransactionDetails;
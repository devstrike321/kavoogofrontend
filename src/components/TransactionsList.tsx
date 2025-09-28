import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth';

const TransactionsList: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/transactions', { headers: { Authorization: `Bearer ${getToken()}` } });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => (tx.id?.toLowerCase() || '').includes(search.toLowerCase()));

  return (
    <div>
      <h1>{t('transactions')}</h1>
      <input className="search-bar" type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
      <table className="table">
        <thead>
          <tr>
            <th>{t('transactionId')}</th>
            <th>{t('date')}</th>
            <th>{t('rewardType')}</th>
            <th>{t('amount')}</th>
            <th>{t('status')}</th>
            <th>{t('campaign')}</th>
            <th>{t('partner')}</th>
            <th>{t('user')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(tx => (
            <tr key={tx._id}>
              <td><Link to={`/transactions/${tx._id}`}>{tx.id || 'N/A'}</Link></td>
              <td>{tx.date || 'N/A'}</td>
              <td>{tx.rewardType || 'N/A'}</td>
              <td>${tx.amount ?? 0}</td>
              <td><span className={`status-badge status-${(tx.status?.toLowerCase() || 'unknown')}`}>{t(tx.status?.toLowerCase() || 'unknown')}</span></td>
              <td>{tx.campaign?.name || 'N/A'}</td>  {/* Access .name if campaign is an object */}
              <td>{tx.partner?.name || 'N/A'}</td>   {/* Access .name if partner is an object */}
              <td>{tx.user?.name || 'N/A'}</td>      {/* Access .name if user is an object */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="primary" onClick={async () => {
        try {
          const res = await axios.get('/api/transactions/export', { headers: { Authorization: `Bearer ${getToken()}` }, responseType: 'blob' });
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'transactions.csv');
          document.body.appendChild(link);
          link.click();
        } catch (err) {
          console.error(err);
        }
      }}>{t('export', { defaultValue: 'Export' })}</button>
    </div>
  );
};

export default TransactionsList;
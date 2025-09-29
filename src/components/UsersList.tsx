import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admins/users', { headers: { Authorization: `Bearer ${getToken()}` } });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Safely handle undefined/null name with optional chaining and fallback
  const filteredUsers = users.filter(user => (user.name?.toLowerCase() || '').includes(search.toLowerCase()));
  return (
    <div>
      <h1>{t('users')}</h1>
      <input className="search-bar" type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
      <table className="table">
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('city')}</th>
            <th>{t('phone')}</th>
            <th>{t('lastCampaign')}</th>
            <th>{t('status')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <td onClick={() => navigate(`/users/${user._id}`)}>{user.name}</td>
              <td>{user.city}</td>
              <td>{user.phone}</td>
              <td>{user.lastCampaign || 'N/A'}</td>
              <td><span className={`status-badge status-${(user.status?.toLowerCase() || 'unknown')}`}>{t(user.status?.toLowerCase() || 'unknown')}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
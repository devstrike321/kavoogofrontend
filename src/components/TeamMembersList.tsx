import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth';

const TeamMembersList: React.FC = () => {
  const { t } = useTranslation();
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('/api/admins/team', { headers: { Authorization: `Bearer ${getToken()}` } });
        setTeam(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div>
      <h1>{t('teamMembers')}</h1>
      <Link to="/add-team-member" className="primary" style={{ float: 'right' }}>{t('addNewTeamMember', { defaultValue: 'Add New Team Member' })}</Link>
      <input className="search-bar" type="text" placeholder={t('search')} />
      <table className="table">
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('email')}</th>
            <th>{t('role')}</th>
            <th>{t('status')}</th>
            <th>{t('actions', { defaultValue: 'Actions' })}</th>
          </tr>
        </thead>
        <tbody>
          {team.map(member => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td><span className={`status-badge status-${member.status.toLowerCase()}`}>{t(member.status.toLowerCase())}</span></td>
              <td><Link to={`/team-members/edit/${member._id}`}>{t('edit')}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersList;
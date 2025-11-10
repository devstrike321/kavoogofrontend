import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import Spinner from './Spinner';

const TeamMembersList: React.FC = () => {
  const { t } = useTranslation();
  const [team, setTeam] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admins/team', { headers: { Authorization: `Bearer ${getToken()}` } });
        setTeam(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div>
      <h1>{t('teamMembers')}</h1>
      {loading && <Spinner />}
      <button onClick={()=>navigate("/add-team-member")} className="primary" style={{ float: 'right' }}>{t('addNewTeamMember', { defaultValue: 'Add New Team Member' })}</button>
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
            <tr key={member.id}>
              <td>{member.firstName} {member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.title.charAt(0).toUpperCase() + member.title.slice(1)}</td>
              <td><span className={`status-badge status-${member.status?.toLowerCase() || 'active'}`}>{t(member.status?.toLowerCase() || 'active')}</span></td>
              <td><p style={{ cursor: "pointer" }} onClick={() => navigate(`/team-members/edit/${member.id}`)}>{t('edit')}</p></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersList;

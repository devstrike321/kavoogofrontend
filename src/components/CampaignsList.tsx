import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "./Spinner";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 10;

const CampaignsList: React.FC = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [currentPage, setCurrentPage] = useState(1);

  const role = useSelector((state: RootState) => state.auth.role);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if(role !== 'adminUser' && role !== 'partner') return;
        setLoading(true);
        if(role === 'partner'){
          const res = await axios.get('/api/partners/campaigns', { headers: { Authorization: `Bearer ${getToken()}` } });
          setCampaigns(res.data);
          return;
        }
        const res = await axios.get('/api/admins/campaigns', { headers: { Authorization: `Bearer ${getToken()}` } });
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = campaigns.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div>
      <h1>{t('campaigns')}</h1>
      {loading && <Spinner />}
      <button className="primary" style={{ float: 'right' }} onClick={()=>navigate("/create-campaign")} >{t('createNewCampaign', { defaultValue: 'Create New Campaign' })}</button>
      <table className="table">
        <thead>
          <tr>
            <th>{t('title', { defaultValue: 'Title' })}</th>
            <th>{t('partner')}</th>
            <th>{t('status')}</th>
            <th>{t('activityType')}</th>
            <th>{t('startDate')}</th>
            <th>{t('endDate')}</th>
            <th>{t('creationDate', { defaultValue: 'Creation Date' })}</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(camp => (
            <tr key={camp.id}>
              <td onClick={()=>navigate(`/campaigns/${camp.id}`)}>{camp.name}</td>
              <td>{camp.partner?.partnerName || ''}</td>
              <td><span className={`status-badge status-${(camp.status?.toLowerCase() || 'unknown')}`}>{t(camp.status?.toLowerCase() || 'unknown')}</span></td>
              <td>{camp.activityType || ''}</td>
              <td>{camp.startDate?.split('T')[0] || ''}</td>
              <td>{camp.endDate?.split('T')[0] || ''}</td>
              <td>{camp.createdAt?.split('T')[0] || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages = {totalPages}
        currentPage = {currentPage}
        onPageChange = {setCurrentPage}
      />
    </div>
  );
};

export default CampaignsList;

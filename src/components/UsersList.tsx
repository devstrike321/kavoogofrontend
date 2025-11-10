import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import Spinner from "./Spinner";
import Pagination from './Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admins/users', { headers: { Authorization: `Bearer ${getToken()}` } });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const cities = Array.from(new Set(users.map(u => u.city).filter(Boolean)));
  const campaigns = Array.from(new Set(users.map(u => u.transactions?.[0]?.campaign?.name).filter(Boolean)));
  const statuses = Array.from(new Set(users.map(u => u.transactions?.[0]?.campaign?.status).filter(Boolean)));

  // 🟩 Mapping for correct plural labels
  const allLabels: { [key: string]: string } = {
    City: t("All Cities"),
    Status: t("All Statuses"),
    "Last Campaign": t("All Last Campaigns"),
  };

  const parseFilters = (search: string) => {
    const filters: { [key: string]: string } = {};
    const parts = search.split(',').map(p => p.trim());
    const remainingParts: string[] = [];

    parts.forEach((part) => {
      const [key, ...rest] = part.split('=');
      if (rest.length > 0) {
        filters[key.trim().toLowerCase()] = rest.join('=').trim();
      } else if (part) {
        remainingParts.push(part);
      }
    });

    return { filters, remainingText: remainingParts.join(' ') };
  };

  const handleFilterChange = (filterName: "Status" | "City" | "Last Campaign", value: string) => {
    const { filters } = parseFilters(search);
    filters[filterName.toLowerCase()] = value;

    const parts: string[] = [];
    Object.entries(filters).forEach(([key, val]) => {
      if (val) parts.push(`${key.charAt(0).toUpperCase() + key.slice(1)} = ${val}`);
    });

    const { remainingText } = parseFilters(search);
    if (remainingText) parts.push(remainingText);

    setSearch(parts.join(', '));
  };

  const filteredUsers = users.filter((user) => {
    const name = `${user.firstName} ${user.lastName}`.toLowerCase();
    const city = user.city || '';
    const campaign = user.transactions?.[0]?.campaign?.name || '';
    const status = user.transactions?.[0]?.campaign?.status || '';

    const { filters, remainingText } = parseFilters(search);

    const matchesStatus = filters.status ? status.toLowerCase() === filters.status.toLowerCase() : true;
    const matchesCity = filters.city ? city.toLowerCase() === filters.city.toLowerCase() : true;
    const matchesCampaign = filters["last campaign"] ? campaign.toLowerCase() === filters["last campaign"].toLowerCase() : true;
    const matchesName = remainingText ? name.includes(remainingText.toLowerCase()) : true;

    return matchesStatus && matchesCity && matchesCampaign && matchesName;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = filteredUsers.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{t('users')}</h1>
      {loading && <Spinner />}
      
      <input
        className="search-bar mb-4 px-4 py-2 border rounded w-full max-w-md"
        type="text"
        placeholder={t('search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter dropdowns */}
      <div className="filters-container flex gap-2 mb-4">
        {[
          { label: "City", values: cities },
          { label: "Status", values: statuses },
          { label: "Last Campaign", values: campaigns },
        ].map((filter) => (
          <div key={filter.label} className="filter-group relative">
            <button
              className="filter-button px-3 py-1 border rounded flex items-center gap-1"
              onClick={() => setOpenDropdown(openDropdown === filter.label ? null : filter.label)}
            >
              {parseFilters(search).filters[filter.label.toLowerCase()] || allLabels[filter.label]}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === filter.label ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {openDropdown === filter.label && (
                <motion.div
                  className="filter-dropdown absolute z-10 bg-white shadow rounded mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <div
                    className="filter-option px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => { handleFilterChange(filter.label as any, ''); setOpenDropdown(null); }}
                  >
                    {allLabels[filter.label]}
                  </div>
                  {filter.values.map(v => (
                    <div
                      key={v}
                      className="filter-option px-3 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => { handleFilterChange(filter.label as any, v); setOpenDropdown(null); }}
                    >
                      {v}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <table className="table w-full border-collapse">
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
          {pageData.map(user => (
            <tr key={user.id}>
              <td onClick={() => navigate(`/users/${user.id}`)}>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.city}</td>
              <td>{user.phone}</td>
              <td>{t(user.transactions[0]?.campaign?.name || 'noCampaign')}</td>
              <td>
                <span className={`status-badge status-${(user.transactions[0]?.campaign?.status?.toLowerCase() || 'noStatus')}`}>
                  {t(user.transactions?.campaign?.status?.toLowerCase() || 'noStatus')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UsersList;

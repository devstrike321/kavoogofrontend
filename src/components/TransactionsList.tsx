import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "./Spinner";
import Pagination from './Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const TransactionsList: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/transactions", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const statuses = Array.from(new Set(transactions.map(tx => tx.status).filter(Boolean)));
  const dateOptions = ["Today", "In a Week", "In One Month", "In One Year", "All Dates"];

  const allLabels: { [key: string]: string } = {
    Status: t("All Statuses"),
    Date: t("All Dates"),
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

  const handleFilterChange = (filterName: "Status" | "Date", value: string) => {
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

  const filteredTransactions = transactions.filter(tx => {
    const { filters, remainingText } = parseFilters(search);

    const matchesStatus = filters.status ? tx.status.toLowerCase() === filters.status.toLowerCase() : true;

    // Filter by previous dates
    let matchesDate = true;
    if (filters.date && filters.date !== "All Dates") {
      const txDate = new Date(tx.date);
      const now = new Date();
      const diff = now.getTime() - txDate.getTime();
      const dayDiff = diff / (1000 * 60 * 60 * 24);

      switch (filters.date) {
        case "Today": matchesDate = dayDiff < 1; break;
        case "In a Week": matchesDate = dayDiff <= 7; break;
        case "In One Month": matchesDate = dayDiff <= 30; break;
        case "In One Year": matchesDate = dayDiff <= 365; break;
        default: matchesDate = true;
      }
    }

    const matchesText = remainingText ? (tx.transactionId?.toLowerCase() || '').includes(remainingText.toLowerCase()) : true;

    // Role filter
    const roleFilter = (tx.campaign?.partner?.id == userId && role === "partner") || role === "adminUser";

    return matchesStatus && matchesDate && matchesText && roleFilter;
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = filteredTransactions.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{t("transactions")}</h1>
      {loading && <Spinner /> }

      <input
        className="search-bar mb-4 px-4 py-2 border rounded w-full max-w-md"
        type="text"
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters-container flex gap-2 mb-4">
        {[
          { label: "Status", values: statuses },
          { label: "Date", values: dateOptions },
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
            <th>{t("transactionId")}</th>
            <th>{t("date")}</th>
            <th>{t("amount")}</th>
            <th>{t("status")}</th>
            <th>{t("campaign")}</th>
            <th>{t("partner")}</th>
            <th>{t("user")}</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(tx =>
            <tr key={tx.id}>
              <td onClick={() => navigate(`/transactions/${tx.id}`)}>{tx.transactionId || t('undefined')}</td>
              <td>{tx.date?.split('T')[0] || '' || t('undefined')}</td>
              <td>${tx.campaign?.rewardAmount ?? 0}</td>
              <td><span className={`status-badge status-${tx.status?.toLowerCase() || "failed"}`}>{t(tx.status?.toLowerCase() || "failed")}</span></td>
              <td>{tx.campaign?.name || t('undefined')}</td>
              <td>{tx.campaign?.partner?.partnerName || t('undefined')}</td>
              <td>{(tx.user?.firstName || tx.user?.lastName) ? `${tx.user?.firstName || ''} ${tx.user?.lastName || ''}` : t('undefined')}</td>
            </tr>
          )}
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

export default TransactionsList;

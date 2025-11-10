import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";
import Spinner from "./Spinner";
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 10;

const RewardsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admins/providers", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setProviders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

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

  let totalCash = 0;

  transactions.map((tx) => {
    totalCash += tx.campaign?.rewardAmount || 0;
  });

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = transactions.slice(start, start + ITEMS_PER_PAGE);



  return (
    <div>
      <h1>{t("rewards")}</h1>
      {loading && <Spinner />}
      <div className="section-title">
        {t("totalRewardsDistributed", {
          defaultValue: "Total Rewards Distributed",
        })}
      </div>
      <div className="stat-card" style={{width:"30%"}}>
        <div className="stat-label">{t("totalCash")}</div>
        <div className="stat-value">${totalCash}</div>
      </div>
      <div className="section-title">{t("mobileProviders")}</div>
      <table className="table">
        <thead>
          <tr>
            <th>{t("cashAmount")}</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((prov: any) => (
            <tr key={prov.id}>
              <td>${prov.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="section-title">
        {t("rewardTransactions", { defaultValue: "Reward Transactions" })}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>{t("transactionId")}</th>
            <th>{t("date")}</th>
            <th>{t("type", { defaultValue: "Type" })}</th>
            <th>{t("amount")}</th>
            <th>{t("status")}</th>
            <th>{t("Campaign")}</th>
            <th>{t("partner")}</th>
            <th>{t("user")}</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((tx: any) => (
            <tr key={tx.id}>
              <td>{tx.transactionId}</td>
              <td>{tx.date}</td>
              <td>{"Cash"}</td>
              <td>${tx.campaign?.rewardAmount || 0}</td>
              <td>
                <span
                  className={`status-badge status-${
                    tx.status?.toLowerCase() || "failed"
                  }`}
                >
                  {t(tx.status?.toLowerCase() || "failed")}
                </span>
              </td>
              <td>{tx.campaign?.name}</td>
              <td>{tx.campaign?.partner?.partnerName}</td>
              <td>{tx.user?.firstName}</td>
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

export default RewardsManagement;

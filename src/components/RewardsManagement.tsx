import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

const RewardsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("/api/admins/providers", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setProviders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/api/transactions", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  let totalCash = 0;

  transactions.map((tx) => {
    totalCash += tx.Campaign?.rewardAmount || 0;
  });



  return (
    <div>
      <h1>{t("rewards")}</h1>
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
          {transactions.map((tx: any) => (
            <tr key={tx.id}>
              <td>{tx.transactionId}</td>
              <td>{tx.date}</td>
              <td>{"Cash"}</td>
              <td>${tx.Campaign?.rewardAmount || 0}</td>
              <td>
                <span
                  className={`status-badge status-${
                    tx.status?.toLowerCase() || "failed"
                  }`}
                >
                  {t(tx.status?.toLowerCase() || "failed")}
                </span>
              </td>
              <td>{tx.Campaign?.name}</td>
              <td>{tx.Campaign?.Partner?.partnerName}</td>
              <td>{tx.User?.firstName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardsManagement;

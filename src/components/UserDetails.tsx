import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

const UserDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>({
    targetingData: {},
    transactions: [],
  });
  const [transactionsDetails, setTransactionsDetails] = useState<{ [key: string]: any }>({});
  const [loadingTransactions, setLoadingTransactions] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admins/users/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  const fetchTransactions = async (transactionId: string) => {
    if (transactionsDetails[transactionId]) return; // Skip if already fetched

    setLoadingTransactions(prev => new Set(prev).add(transactionId));
    try {
      const res = await axios.get(`/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTransactionsDetails(prev => ({ ...prev, [transactionId]: res.data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTransactions(prev => {
        const newSet = new Set(prev);
        newSet.delete(transactionId);
        return newSet;
      });
    }
  };

  // Fetch all transaction details once after user loads
  useEffect(() => {
    if (user.transactions?.length > 0) {
      user.transactions.forEach((tx: any) => {
        fetchTransactions(tx); // Assuming tx._id is the ID; adjust if it's tx.id
      });
    }
  }, [user.transactions]);

  const getTransactionData = (txId: string) => transactionsDetails[txId] || {};

  return (
    <div>
      <h1>{t("userDetails")}</h1>
      <button
        onClick={() => navigate(`/users/edit/${id}`)}
        className="primary"
        style={{ float: "right" }}
      >
        {t("edit")}
      </button>
      <div className="section-title">{t("userProfileDetails")}</div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">
            {t("lastName", { defaultValue: "Last Name" })}
          </div>
          <div className="detail-value">{user.lastName || ''}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">
            {t("firstName", { defaultValue: "First Name" })}
          </div>
          <div className="detail-value">{user.firstName || ''}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-two">
          <div className="detail-label">{t("phone")}</div>
          <div className="detail-value">{user.phone || '+1234567890'}</div>
        </div>
      </div>
      <div className="section-title">{t("targetingData")}</div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">
            {t("dateOfBirth", { defaultValue: "Date of Birth" })}
          </div>
          <div className="detail-value">{user.dateOfBirth || ''}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("country")}</div>
          <div className="detail-value">{user.country || ''}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("city")}</div>
          <div className="detail-value">{user.city || ''}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("employmentStatus")}</div>
          <div className="detail-value">
            {user.employmentStatus || ''}
          </div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("educationLevel")}</div>
          <div className="detail-value">
            {user.educationLevel || ''}
          </div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("salaryRange")}</div>
          <div className="detail-value">{(user.salaryRangeMin + '-' + user.salaryRangeMax) || ''}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("maritalStatus")}</div>
          <div className="detail-value">
            {user.maritalStatus || ''}
          </div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("kidsNoKids")}</div>
          <div className="detail-value">{t(user.hasKids || 'Yes')}</div>
        </div>
      </div>
      <div className="section-title">{t("rewards")}</div>
      <div className="detail-row">
        <div className="flex-item-two">
          <div className="detail-label">
            {t("cumulativeCash", { defaultValue: "Cumulative Cash" })}
          </div>
          <div className="detail-value">${user.rewards || 0}</div>
        </div>
      </div>
      <div className="section-title">{t("transactionDetails")}</div>
      <table className="table">
        <thead>
          <tr>
            <th>{t("campaignName")}</th>
            <th>{t("activityType")}</th>
            <th>{t("partner")}</th>
            <th>{t("status")}</th>
            <th>{t("date")}</th>
          </tr>
        </thead>
        <tbody>
          {user.transactions.map((tx: any) => {
            const txData = getTransactionData(tx);
            console.log(txData);
            const isLoading = loadingTransactions.has(tx);
            return (
              <tr key={txData._id}>
                <td>{isLoading ? 'Loading...' : t(txData.campaign?.name || 'noCampaign')}</td>
                <td>{isLoading ? 'Loading...' : t(txData.campaign?.activityType || 'noCampaign')}</td>
                <td>{isLoading ? 'Loading...' : t(txData.campaign?.partner?.partnerName || 'noCampaign')}</td>
                <td>
                  <div
                    className={`status-badge status-${(txData.status?.toLowerCase() || '').replace(' ', '-') || ''}`}
                  >
                    {t((txData.status?.toLowerCase() || '').replace(' ', '-') || 'noCampaign')}
                  </div>
                </td>
                <td>{isLoading ? 'Loading...' : t(txData.createdAt || 'noCampaign')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
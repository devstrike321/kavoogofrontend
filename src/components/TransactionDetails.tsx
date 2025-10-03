import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

const TransactionDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [tx, setTx] = useState<any>({ participant: {} });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await axios.get(`/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTx(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTx();
  }, [id]);

  return (
    <div>
      <h1>{t("transactionDetails")}</h1>
      <div className="section-title">
        {t("transactionProfile", { defaultValue: "Transaction Profile" })}
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("transactionId")}</div>
          <div className="detail-value">{tx.transactionId || t('undefined')}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("date")}</div>
          <div className="detail-value">{tx.date || t('undefined')}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-two">
          <div className="detail-label">{t("status")}</div>
          <div className="detail-value">{tx.status??t("failed")}</div>
        </div>
      </div>

      <div className="section-title">{t("campaignDetails")}</div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("campaignName")}</div>
          <div className="detail-value">{tx.campaign?.name || t('noCampaign')}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("activityType")}</div>
          <div className="detail-value">{tx.campaign?.activityType || t('noCampaign')}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("rewardType")}</div>
          <div className="detail-value">Cash</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("amount")}</div>
          <div className="detail-value">${tx.campaign?.rewardAmount || 0}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-two">
          <div className="detail-label">{t("partner")}</div>
          <div className="detail-value">{tx.campaign?.partner?.name || t('noCampaign')}</div>
        </div>
      </div>
      <div className="section-title">
        {t("participantDetails", { defaultValue: "Participant Details" })}
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("user")}</div>
          <div className="detail-value">{(tx.user?.firstName || tx.user?.lastName) ? (tx.user?.firstName + ' ' + tx.user?.lastName) : t('undefined')}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("phone")}</div>
          <div className="detail-value">{tx.user?.phone || t('undefined')}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("country")}</div>
          <div className="detail-value">{tx.user?.country || t('undefined')}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("city")}</div>
          <div className="detail-value">{tx.user?.city || t('undefined')}</div>
        </div>
      </div>
      <button onClick={() => navigate("/transactions")} className="secondary">
        {t("back")}
      </button>
    </div>
  );
};

export default TransactionDetails;

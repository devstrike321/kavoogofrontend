import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";
import Spinner from "./Spinner";

const UserDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>({
    targetingData: {},
    transactions: [],
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admins/users/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div>
      <span style={{cursor:"pointer", color:"orange"}} onClick={()=>navigate(-1)}>{t("users")} </span> <span> / {t('userDetails', { defaultValue: 'User Details' })}</span>
      <h1>{t("userDetails")}</h1>
      {loading && <Spinner /> }
      <button
        onClick={() => navigate(`/users/edit/${id}`)}
        className="secondary"
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
          <div className="detail-value">{user.dateOfBirth?.split('T')[0] || '' || ''}</div>
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
          <div className="detail-value">{t(user.hasKids? 'Yes':'No')}</div>
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
          {user.transactions?.map((tx: any) => {
            console.log(tx);
            return (
              <tr key={tx.id}>
                <td>{ t(tx.campaign?.name || 'noCampaign')}</td>
                <td>{ t(tx.campaign?.activityType || 'noCampaign')}</td>
                <td>{ t(tx.campaign?.partner?.partnerName || 'noCampaign')}</td>
                <td>
                  <div
                    className={`status-badge status-${(tx.status?.toLowerCase() || '').replace(' ', '-') || ''}`}
                  >
                    {t((tx.status?.toLowerCase() || '').replace(' ', '-') || 'noCampaign')}
                  </div>
                </td>
                <td>{ t(tx.createdAt?.split('T')[0] || '' || 'noCampaign')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;

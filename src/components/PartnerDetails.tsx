import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

const PartnerDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<any>({ campaigns: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await axios.get(`/api/partners/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setPartner(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartner();
  }, [id]);

  return (
    <div>
      <h1>{t("partnerDetails")}</h1>
      <button
        onClick={() => navigate(`/partners/edit/${id}`)}
        className="primary"
        style={{ float: "right" }}
      >
        {t("edit")}
      </button>
      <div className="section-title">
        {t("partnerInformation", { defaultValue: "Partner Information" })}
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("partnerName")}</div>
          <div className="detail-value">{partner.partnerName || "N/A"}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("country")}</div>
          <div className="detail-value">{partner.country || "N/A"}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("status")}</div>
          <div className="detail-value">{partner.status || "N/A"}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("contactPerson")}</div>
          <div className="detail-value">{partner.contactPerson || "N/A"}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("email")}</div>
          <div className="detail-value">{partner.email || "N/A"}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("phoneNumber")}</div>
          <div className="detail-value">{partner.phoneNumber || "N/A"}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-two">
          <div className="detail-label">{t("industry")}</div>
          <div className="detail-value">{partner.industry || "N/A"}</div>
        </div>
      </div>
      <div className="section-title">
        {t("associatedCampaigns", { defaultValue: "Associated Campaigns" })}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>{t("campaignName")}</th>
            <th>{t("activityType")}</th>
            <th>{t("status")}</th>
            <th>{t("startDate")}</th>
            <th>{t("endDate")}</th>
          </tr>
        </thead>
        <tbody>
          {partner.campaigns.map((camp: any) => (
            <tr key={camp._id}>
              <td>{camp.name || "N/A"}</td>
              <td>{camp.activityType || "N/A"}</td>
              <td>
                <div
                  className={`status-badge status-${
                    camp.status?.toLowerCase() || "unknown"
                  }`}
                >
                  {t(camp.status?.toLowerCase() || "unknown")}
                </div>
              </td>
              <td>{camp.startDate || "N/A"}</td>
              <td>{camp.endDate || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerDetails;

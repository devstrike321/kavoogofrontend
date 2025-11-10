import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";
import Spinner from "./Spinner"

const CampaignDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null); // Start with null for clearer loading check
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setCampaign(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load campaign details."); // Set error message
      } finally {
        setLoading(false); // Always stop loading
      }
    };
    fetchCampaign();
  }, [id]); // Add 'id' to deps if it might change, but [] is fine if static

  if (loading) {
    return <Spinner /> // Simple loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Error fallback
  }

  if (!campaign) {
    return (
      <div>{t("noData", { defaultValue: "No campaign data found." })}</div>
    ); // Edge case
  }

  return (
    <div>
      <span style={{cursor:"pointer", color:"orange"}} onClick={()=>navigate(-1)}>{t("Campaign")} </span> <span> / {t("campaignDetails")}</span>
      <button
        onClick={() => navigate(`/campaigns/edit/${id}`)}
        className="secondary"
        style={{ float: "right" }}
      >
        {t("edit")}
      </button>
      <h1>{t("campaignDetails")}</h1>
      {loading && <Spinner />}
      <div className="section-title">{t("campaignDetails")}</div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("campaignName")}</div>
          <div className="detail-value">{campaign.name ?? ""}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("description")}</div>
          <div className="detail-value">{campaign.description ?? ""}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("partner")}</div>
          <div className="detail-value">{campaign.partner?.partnerName ?? ""}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("activityType")}</div>
          <div className="detail-value">{campaign.activityType ?? ""}</div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("startDate")}</div>
          <div className="detail-value">{campaign.startDate ?? ""}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("endDate")}</div>
          <div className="detail-value">{campaign.endDate ?? ""}</div>
        </div>
      </div>
      <div className="section-title">
        {t("userTargeting", { defaultValue: "User Targeting" })}
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("ageRange")}</div>
          <div className="detail-value">
            {campaign.minAge ?? "18"} - {campaign.maxAge ?? "59"}
          </div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("country")}</div>
          <div className="detail-value">
            {campaign.country ?? "Côte d’Ivoire"}
          </div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("city")}</div>
          <div className="detail-value">{campaign.city ?? "Abidjan"}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("employmentStatus")}</div>
          <div className="detail-value">
            {campaign.employmentStatus ?? "Employed"}
          </div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("educationLevel")}</div>
          <div className="detail-value">
            {campaign.educationLevel ?? "primary school"}
          </div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("salaryRange")}</div>
          <div className="detail-value">
            {campaign.minSalary  ?? "0"} - {campaign.maxSalary ?? "25000"}
          </div>
        </div>
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("maritalStatus")}</div>
          <div className="detail-value">
            {campaign.maritalStatus ?? "Single"}
          </div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("kidsNoKids")}</div>
          <div className="detail-value">{campaign.hasKids ? "Yes":"No"}</div>
        </div>
      </div>
      <div className="section-title">{t("rewards")}</div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">
            {t("rewardType", { defaultValue: "Cash" })}
          </div>
          <div className="detail-value">Cash</div>{" "}
          {/* Assuming this is static; adjust if dynamic */}
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("amount")}</div>
          <div className="detail-value">${campaign.rewardAmound ?? "500"}</div>
        </div>
      </div>
      <div className="section-title">
        {t("budgetAndLimit", { defaultValue: "Budget and Limit" })}
      </div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("totalBudget")}</div>
          <div className="detail-value">${campaign.totalBudget ?? ""}</div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("costPerUser")}</div>
          <div className="detail-value">${campaign.costPerUser ?? ""}</div>
        </div>
      </div>
      <div className="section-title">{t("content")}</div>
      <div className="detail-row">
        <div className="flex-item-one">
          <div className="detail-label">{t("video")}</div>
          <div className="detail-value">
            {campaign.videoUrl ?? "Video thumbnail"}
          </div>
        </div>
        <div className="flex-item-two">
          <div className="detail-label">{t("surveyLink")}</div>
          <div className="detail-value">{campaign.surveyLink ?? "No Survey Link"}</div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Dropzone from "react-dropzone";
import { getToken } from "../utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "./Spinner";

const EditCampaign: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [costUser, setCostUser] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.userId);

  // Fetch partners
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admins/partners", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setPartners(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const campaign = res.data;

        setValue("name", campaign.name ?? "");
        setValue("description", campaign.description ?? "");
        setValue("partner", campaign.partner?.id ?? "");
        setValue("activityType", campaign.activityType ?? "");
        setValue("startDate", campaign.startDate?.split("T")[0] ?? "");
        setValue("endDate", campaign.endDate?.split("T")[0] ?? "");
        setValue("minAge", campaign.minAge ?? 18);
        setValue("maxAge", campaign.maxAge ?? 59);
        setValue("country", campaign.country ?? "");
        setValue("city", campaign.city ?? "");
        setValue("employmentStatus", campaign.employmentStatus ?? "");
        setValue("educationLevel", campaign.educationLevel ?? "");
        setValue("minSalary", campaign.minSalary ?? 0);
        setValue("maxSalary", campaign.maxSalary ?? 25000);
        setValue("maritalStatus", campaign.maritalStatus?.toLowerCase() ?? "");
        setValue("hasKids", campaign.hasKids ? "true" : "false");
        setValue("rewardAmount", campaign.rewardAmount ?? 0);
        setValue("totalBudget", campaign.totalBudget ?? 0);
        setValue("costPerUser", campaign.costPerUser ?? 0);
        setValue("numberOfUsers", campaign.maxUsers ?? 0);
        setValue("survey", campaign.surveyLink ?? "");
        setVideoUrl(campaign.videoUrl ?? null);
        setTotalCost(campaign.totalBudget ?? 0);
        setCostUser(campaign.costPerUser ?? 0);
        setUserCount(campaign.maxUsers ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, setValue]);

  const getOptions = (key: string): string[] => {
    const options = t(key, { returnObjects: true });
    return Array.isArray(options) ? (options as string[]) : [];
  };

  const costUserEdited = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (totalCost > 0 && value > 0) {
      const users = Math.floor(totalCost / value);
      setUserCount(users);
      setValue("numberOfUsers", users, { shouldValidate: true });
    }
    setCostUser(value);
    setValue("costPerUser", value, { shouldValidate: true });
  };

  const totalCostEdited = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (costUser > 0 && value > 0) {
      const users = Math.floor(value / costUser);
      setUserCount(users);
      setValue("numberOfUsers", users, { shouldValidate: true });
      setTotalCost(value);
      setValue("totalBudget", value, { shouldValidate: true });
    } else if (value > 0 && userCount > 0) {
      const cost = value / userCount;
      setCostUser(cost);
      setValue("costPerUser", cost, { shouldValidate: true });
      setTotalCost(value);
      setValue("totalBudget", value, { shouldValidate: true });
    } else {
      setTotalCost(value);
      setValue("totalBudget", value, { shouldValidate: true });
    }
  };

  const userCountEdited = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (totalCost > 0 && value > 0) {
      const cost = totalCost / value;
      setCostUser(cost);
      setValue("costPerUser", cost, { shouldValidate: true });
    }
    setUserCount(value);
    setValue("numberOfUsers", value, { shouldValidate: true });
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setVideo(acceptedFiles[0]);
      setVideoUrl(null);
    }
  };

  const onAddUrl = () => {
    const urlInput = document.getElementById("video-url-input") as HTMLInputElement;
    if (urlInput?.value) {
      setVideoUrl(urlInput.value);
      setVideo(null);
      urlInput.value = "";
    }
  };

  const dropzone = (
    <div className="upload-container">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>{t("dragOrBrowse")}</p>
            <button className="secondary" type="button">
              {t("browse")}
            </button>
            {video && <p>{t("selected")}: {video.name}</p>}
          </div>
        )}
      </Dropzone>
      <div className="url-section">
        <p>{t("orPasteUrl")}</p>
        <input id="video-url-input" type="text" placeholder="https://www.youtube.com/watch?v=example" />
        <button className="secondary" type="button" onClick={onAddUrl}>
          {t("editUrl")}
        </button>
        {videoUrl && <p>{t("selectedUrl")}: {videoUrl}</p>}
      </div>
    </div>
  );

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "activityType") formData.append(key, data[key]);
    });
    formData.append("activityType", data.activityType);
    if (video) formData.append("video", video);
    if (videoUrl) formData.append("videoUrl", videoUrl);

    if (data.activityType != "Survey" && !video && !videoUrl) {
      alert("This campaign must include a video file...");
      setLoading(false);
      return;
    }
    if (data.activityType != "Video" && !data.survey) {
      alert("This campaign must include survey questions...");
      setLoading(false);
      return;
    }

    try {
      await axios.patch(`/api/campaigns/${id}`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      navigate("/campaigns");
    } catch (err) {
      console.error(err);
      navigate("/create-campaign-failure");
    } finally {
      setLoading(false);
    }
  };

  const defaultPartnerId =
    role === "adminUser"
      ? partners[0]?.id
      : partners.find((p) => p.id === userId)?.id;

  useEffect(() => {
    if (defaultPartnerId) setValue("partner", defaultPartnerId);
  }, [defaultPartnerId, setValue]);

  return (
    <div>
      <span style={{ cursor: "pointer", color: "orange" }} onClick={() => navigate("/campaigns")}>
        {t("Campaign")}
      </span>{" "}
      <span style={{ cursor: "pointer", color: "orange" }} onClick={() => navigate(-1)}>/ {t("campaignDetails")}
      </span>{" "}
      / {t("editCampaign")}
      <h1>{t("editCampaign")}</h1>
      {loading && <Spinner />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="section-title">{t("campaignDetails")}</div>

        <label>{t("campaignName")}</label>
        <input {...register("name")} />

        <label>{t("description")}</label>
        <textarea {...register("description")} />

        <label>{t("partner")}</label>
        <select {...register("partner")}>
          {role === "adminUser" &&
            partners.map((p) => <option key={p.id} value={p.id}>{p.partnerName}</option>)}
          {role === "partner" &&
            partners.filter((p) => p.id === userId).map((p) => <option key={p.id} value={p.id}>{p.partnerName}</option>)}
        </select>

        <label>{t("activityType")}</label>
        <select {...register("activityType")}>
          {getOptions("activityTypes").map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label>{t("startDate")}</label>
        <input type="date" {...register("startDate")} />

        <label>{t("endDate")}</label>
        <input type="date" {...register("endDate")} />

        <div className="section-title">{t("userTargeting")}</div>
        <label>{t("ageRange")}</label>
        <div className="min-max-inputs">
          <input type="number" {...register("minAge")} placeholder={t("minAge")} />
          <input type="number" {...register("maxAge")} placeholder={t("maxAge")} />
        </div>

        <label>{t("country")}</label>
        <select {...register("country")}>{getOptions("countries").map((c) => <option key={c} value={c}>{c}</option>)}</select>

        <label>{t("city")}</label>
        <select {...register("city")}>{getOptions("cities").map((c) => <option key={c} value={c}>{c}</option>)}</select>

        <label>{t("employmentStatus")}</label>
        <input {...register("employmentStatus")} />

        <label>{t("educationLevel")}</label>
        <input {...register("educationLevel")} />

        <label>{t("salaryRange")}</label>
        <div className="min-max-inputs">
          <input type="number" {...register("minSalary")} placeholder={t("minSalary")} />
          <input type="number" {...register("maxSalary")} placeholder={t("maxSalary")} />
        </div>

        <label>{t("maritalStatus")}</label>
        <select {...register("maritalStatus")}>{getOptions("maritalStatuses").map((m) => <option key={m} value={m.toLowerCase()}>{m}</option>)}</select>

        <label>{t("kidsNoKids")}</label>
        <select {...register("hasKids")}>{getOptions("kidsOptions").map((k) => <option key={k} value={k === "Yes" ? "true" : "false"}>{k}</option>)}</select>

        <div className="section-title">{t("rewards")}</div>
        <label>{t("rewardAmount")}</label>
        <input type="number" {...register("rewardAmount")} />

        <div className="section-title">{t("budgetAndLimit")}</div>
        <label>{t("totalBudget")}</label>
        <input type="number" {...register("totalBudget", { onChange: totalCostEdited })} />

        <label>{t("costPerUser")}</label>
        <input type="number" {...register("costPerUser", { onChange: costUserEdited })} />

        <label>{t("numberOfUsers")}</label>
        <input type="number" {...register("numberOfUsers", { onChange: userCountEdited })} />

        <div className="section-title">{t("content")}</div>
        {dropzone}

        <label>{t("surveyLink")}</label>
        <input {...register("survey")} placeholder={t("enterSurveyLink")} />

        <button className="primary" type="submit" disabled={loading || !defaultPartnerId}>
          {t("save")}
        </button>
      </form>
    </div>
  );
};

export default EditCampaign;

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropzone from "react-dropzone";
import { getToken } from "../utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const CreateCampaign: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [video, setVideo] = useState<File | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // New loading state

  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admins/partners");
        setPartners(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const defaultPartnerId =
    role === "adminUser"
      ? partners[0]?.id
      : partners.find((p) => p.id === userId)?.id;
  
  const defaultMinAge = 18, defaultMaxAge = 59, defaultMinSalary = 0, defaultMaxSalary = 25000;

  // Set the default partner in form state after fetch
  useEffect(() => {
    if (defaultPartnerId) {
      setValue("partner", defaultPartnerId);
    }
    setValue("minAge", defaultMinAge);
    setValue("maxAge", defaultMaxAge);
    setValue("minSalary", defaultMinSalary);
    setValue("maxSalary", defaultMaxSalary);
  }, [defaultPartnerId, setValue]);

  const onDrop = (acceptedFiles: File[]) => {
    setVideo(acceptedFiles[0]);
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("partner", data.partner);
    formData.append("activityType", data.activityType);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("minAge", data.minAge);
    formData.append("maxAge", data.maxAge);
    formData.append("country", data.country);
    formData.append("city", data.city);
    formData.append("employmentStatus", data.employmentStatus);
    formData.append("educationLevel", data.educationLevel);
    formData.append("minSalary", data.minSalary);
    formData.append("maxSalary", data.maxSalary);
    formData.append("maritalStatus", data.maritalStatus);
    formData.append("hasKids", data.kidsNoKids);
    formData.append("rewardAmount", data.rewardAmount);
    formData.append("totalBudget", data.totalBudget);
    formData.append("costPerUser", data.costPerUser);
    formData.append("maxUsers", data.numberOfUsers);
    formData.append("survey", data.survey);
    if (video) {
      formData.append("video", video);
    }
    if (data.activityType != "Survey" && !video) {
      alert("This campaign must include a video file...");
      return;
    }
    if (data.activityType != "Video" && !data.survey) {
      alert("This campaign must include survey questions...");
      return;
    }
    try {
      await axios.post("/api/campaigns", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      navigate("/create-campaign-success");
    } catch (err) {
      navigate("/create-campaign-failure");
    }
  };

  // Helper function to safely get array from translation
  const getOptions = (key: string): string[] => {
    const options = t(key, { returnObjects: true });
    return Array.isArray(options) ? (options as string[]) : [];
  };

  const dropzone = (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>{t("dragOrBrowse")}</p>
          <button className="secondary" type="button">
            {t("browse", { defaultValue: "Browse" })}
          </button>
          {video && (
            <p>
              {t("selected", { defaultValue: "Selected" })}: {video.name}
            </p>
          )}
        </div>
      )}
    </Dropzone>
  );

  return (
    <div>
      <h1>{t("createCampaign")}</h1>
      {loading && <p>Loading partners...</p>} {/* Optional feedback */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="section-title">{t("campaignDetails")}</div>
        <label>{t("campaignName")}</label>
        <input {...register("name")} />
        <label>{t("description")}</label>
        <textarea {...register("description")} />
        <label>{t("partner")}</label>
        <select
          {...register("partner", {
            required: true,
          })}
        >
          {role === "adminUser" &&
            partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.partnerName}
              </option>
            ))}
          {role === "partner" &&
            partners
              .filter((partner) => partner.id == userId)
              .map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.partnerName}
                </option>
              ))}
        </select>
        {errors.partner && <p style={{ color: "red" }}>{t("partnerRequired", { defaultValue: "Partner is required" })}</p>} {/* Display error */}
        <label>{t("video")}</label>
        <select {...register("activityType")}>
          {getOptions("activityTypes").map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label>{t("startDate")}</label>
        <input type="date" {...register("startDate")} />
        <label>{t("endDate")}</label>
        <input type="date" {...register("endDate")} />
        <div className="section-title">{t("userTargeting")}</div>
        <label>{t("ageRange")}</label>
        <div className="min-max-inputs">
          <input
            type="number"
            {...register("minAge")}
            placeholder={t("minAge")}
          />
          <input
            type="number"
            {...register("maxAge")}
            placeholder={t("maxAge")}
          />
        </div>
        <label>{t("country")}</label>
        <select {...register("country")}>
          {getOptions("countries").map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label>{t("city")}</label>
        <select {...register("city")}>
          {getOptions("cities").map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label>{t("employmentStatus")}</label>
        <select {...register("employmentStatus")}>
          {getOptions("employmentStatuses").map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label>{t("educationLevel")}</label>
        <select {...register("educationLevel")}>
          {getOptions("educationLevels").map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <label>{t("salaryRange")}</label>
        <div className="min-max-inputs">
          <input
            type="number"
            {...register("minSalary")}
            placeholder={t("minSalary")}
          />
          <input
            type="number"
            {...register("maxSalary")}
            placeholder={t("maxSalary")}
          />
        </div>
        <label>{t("maritalStatus")}</label>
        <select {...register("maritalStatus")}>
          {getOptions("maritalStatuses").map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <label>{t("kidsNoKids")}</label>
        <select {...register("kidsNoKids")}>
          {getOptions("kidsOptions").map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <div className="section-title">{t("rewards")}</div>
        <label>{t("rewardAmount")}</label>
        <input type="number" {...register("rewardAmount")} />
        <div className="section-title">{t("budgetAndLimit")}</div>
        <label>{t("totalBudget")}</label>
        <input type="number" {...register("totalBudget")} />
        <label>{t("costPerUser")}</label>
        <input type="number" {...register("costPerUser")} />
        <label>{t("numberOfUsers")}</label>
        <input type="number" {...register("numberOfUsers")} />
        <div className="section-title">{t("content")}</div>
        {dropzone}
        <label>{t("surveyLink")}</label>
        <input
          {...register("survey")}
          placeholder={t("enterSurveyLink", {
            defaultValue: "Enter survey link",
          })}
        />
        <button className="primary" type="submit" disabled={loading || !defaultPartnerId}>
          {t("create")}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
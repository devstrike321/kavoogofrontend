import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropzone from "react-dropzone";
import { getToken } from "../utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "./Spinner";

const CreateCampaign: React.FC = () => {
  const { t } = useTranslation();
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
  const [loading, setLoading] = useState(true); // New loading state
  const [costUser, setCostUser] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [uploadMethod, setUploadMethod] = useState<string | null>(null);

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

  const defaultMinAge = 18,
    defaultMaxAge = 59,
    defaultMinSalary = 0,
    defaultMaxSalary = 25000;

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

  const onSubmit = async (data: any) => {
    setLoading(true);
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
    formData.append("hasKids", data.hasKids);
    formData.append("rewardAmount", data.rewardAmount);
    formData.append("totalBudget", data.totalBudget);
    formData.append("costPerUser", data.costPerUser);
    formData.append("maxUsers", data.numberOfUsers);
    formData.append("surveyLink", data.surveyLink);
    formData.append("videoUrl", videoUrl || "");
    if (video) {
      formData.append("video", video);
    }
    if (data.activityType != "Survey" && !video && !videoUrl) {
      alert("This campaign must include a video file...");
      setLoading(false);
      return;
    }
    if (data.activityType != "Video" && !data.surveyLink) {
      alert("This campaign must include survey questions...");
      setLoading(false);
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

  const costUserEdited = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if(totalCost>0 && value>0){
      const users = Math.floor(totalCost / value);
      setUserCount(users);
      setValue("numberOfUsers", users, { shouldValidate: true });
    }
    setCostUser(value);
    setValue("costPerUser", value, { shouldValidate: true });
  }

  const totalCostEdited = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if(costUser>0 && value>0){
      const users = Math.floor(value / costUser);
      setUserCount(users);
      setValue("numberOfUsers", users, { shouldValidate: true });
      setTotalCost(value);
      setValue("totalBudget", value, { shouldValidate: true });
    }
    else if(value>0 && userCount>0){
      const cost = value / userCount;
      setCostUser(cost);
      setValue("costPerUser", cost, { shouldValidate: true });
      setTotalCost(value);
      setValue("totalBudget", value, { shouldValidate: true });
    }
    else{
      setTotalCost(value);
      setValue("totalBudget", value, { shouldValidate: true });
    }
  }
  const userCountEdited = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if(totalCost>0 && value>0){
      const cost = totalCost / value;
      setCostUser(cost);
      setValue("costPerUser", cost, { shouldValidate: true });
    }
    setUserCount(value);
      setValue("numberOfUsers", value, { shouldValidate: true });
  }

  // const dropzone = (
  //   <Dropzone onDrop={onDrop}>
  //     {({ getRootProps, getInputProps }) => (
  //       <div {...getRootProps()} className="dropzone">
  //         <input {...getInputProps()} />
  //         <p>{t("dragOrBrowse")}</p>
  //         <button className="secondary" type="button">
  //           {t("browse", { defaultValue: "Browse" })}
  //         </button>
  //         {video && (
  //           <p>
  //             {t("selected", { defaultValue: "Selected" })}: {video.name}
  //           </p>
  //         )}
  //       </div>
  //     )}
  //   </Dropzone>
  // );

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setVideo(acceptedFiles[0]);
      setVideoUrl(null); // Clear URL if file is uploaded
    }
  };

  const onAddUrl = () => {
    const urlInput = document.getElementById(
      "video-url-input"
    ) as HTMLInputElement;
    if (urlInput?.value) {
      setVideoUrl(urlInput.value);
      setVideo(null); // Clear file if URL is added
      urlInput.value = ""; // Optional: Clear input after adding
    }
  };

  const dropzone = (
  <div className="upload-container">
    {/* --- Upload Method Selection --- */}
    <div className="method-selection">
      <div>
        <input
          type="radio"
          style={{width:"auto"}}
          name="uploadMethod"
          value="upload"
          checked={uploadMethod === "upload"}
          onChange={() => setUploadMethod("upload")}
        />
        {t("uploadContent", { defaultValue: "Upload Video File" })}
      </div>
      <div>
        <input
          type="radio"
          style={{width:"auto"}}
          name="uploadMethod"
          value="url"
          checked={uploadMethod === "url"}
          onChange={() => setUploadMethod("url")}
        />
        {t("addUrl", { defaultValue: "Add Video URL" })}
      </div>
    </div>

    {/* --- Dropzone Section --- */}
    {uploadMethod === "upload" && (
      <Dropzone onDrop={onDrop} accept={{ "video/*": [] }}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>{t("dragOrBrowse", { defaultValue: "Drag a file or click Browse" })}</p>
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
    )}

    {/* --- URL Input Section --- */}
    {uploadMethod === "url" && (
      <div className="url-section">
        <p>
          {t("orPasteUrl", {
            defaultValue: "Paste a video URL (e.g., YouTube)",
          })}
        </p>
        <input
          style={{width:"90%"}}
          id="video-url-input"
          type="text"
          placeholder="https://www.youtube.com/watch?v=example"
          className="url-input"
          value={videoUrl??""}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button className="secondary" type="button" onClick={onAddUrl}>
          {t("addUrl", { defaultValue: "SET" })}
        </button>
        {videoUrl && (
          <p>
            {t("selectedUrl", { defaultValue: "Selected URL" })}: {videoUrl}
          </p>
        )}
      </div>
    )}
  </div>
);
  return (
    <div>
      <span style={{cursor:"pointer", color:"orange"}} onClick={()=>navigate(-1)}>{t("campaign")} </span> <span> / {t('createCampaign', { defaultValue: 'Create New Campaign' })}</span>
      <h1>{t("createCampaign")}</h1>      
      {loading && <Spinner />} {/* Optional feedback */}
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
        {errors.partner && (
          <p style={{ color: "red" }}>
            {t("partnerRequired", { defaultValue: "Partner is required" })}
          </p>
        )}{" "}
        {/* Display error */}
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
        <input {...register("employmentStatus")} />
        <label>{t("educationLevel")}</label>
        <input {...register("educationLevel")} />
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
            <option key={m} value={m.toLowerCase()}>
              {m}
            </option>
          ))}
        </select>
        <label>{t("kidsNoKids")}</label>
        <select {...register("hasKids")}>
          {getOptions("kidsOptions").map((k) => (
            <option key={k} value={k=="Yes"?"true":"false"}>
              {k}
            </option>
          ))}
        </select>
        <div className="section-title">{t("rewards")}</div>
        <label>{t("rewardAmount")}</label>
        <input type="number" {...register("rewardAmount")} />
        <div className="section-title">{t("budgetAndLimit")}</div>
        <label>{t("totalBudget")}</label>
        <input type="number" {...register("totalBudget", {onChange:(e)=>{totalCostEdited(e)}})} />
        <label>{t("costPerUser")}</label>
        <input type="number" {...register("costPerUser", {onChange:(e)=>{costUserEdited(e)}})} />
        <label>{t("numberOfUsers")}</label>
        <input type="number" {...register("numberOfUsers", {onChange:(e) => {userCountEdited(e)}})} />
        <div className="section-title">{t("content")}</div>
        {dropzone}
        <label>{t("surveyLink")}</label>
        <input
          {...register("surveyLink")}
          placeholder={t("enterSurveyLink", {
            defaultValue: "Enter survey link",
          })}
        />
        <button
          className="primary"
          type="submit"
          disabled={loading || !defaultPartnerId}
        >
          {t("create")}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;

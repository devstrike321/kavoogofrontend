import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { getToken } from '../utils/auth';
import { useSelector } from "react-redux";
import { RootState } from "../store";

const role = useSelector((state: RootState) => state.auth.role);
const userId = useSelector((state: RootState) => state.auth.userId);

const CreateCampaign: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [video, setVideo] = useState<File | null>(null);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get('/api/admins/partners');
        setPartners(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartners();
  }, []);

  console.log(partners)

  const onDrop = (acceptedFiles: File[]) => {
    setVideo(acceptedFiles[0]);
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('partner', data.partner);
    formData.append('activityType', data.activityType);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('targetingData.ageMin', data.ageMin);
    formData.append('targetingData.ageMax', data.ageMax);
    formData.append('targetingData.country', data.country);
    formData.append('targetingData.city', data.city);
    formData.append('targetingData.employmentStatus', data.employmentStatus);
    formData.append('targetingData.educationLevel', data.educationLevel);
    formData.append('targetingData.salaryMin', data.salaryMin);
    formData.append('targetingData.salaryMax', data.salaryMax);
    formData.append('targetingData.maritalStatus', data.maritalStatus);
    formData.append('targetingData.kidsNoKids', data.kidsNoKids);
    formData.append('rewards.amount', data.rewardAmount);
    formData.append('budget.totalBudget', data.totalBudget);
    formData.append('budget.costPerUser', data.costPerUser);
    formData.append('budget.numberOfUsers', data.numberOfUsers);
    formData.append('survey', data.survey);
    if (video) formData.append('video', video);
    try {
      await axios.post('/api/campaigns', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${getToken()}` },
      });
      navigate('/create-campaign-success');
    } catch (err) {
      navigate('/create-campaign-failure');
    }
  };

  // Helper function to safely get array from translation
  const getOptions = (key: string): string[] => {
    const options = t(key, { returnObjects: true });
    return Array.isArray(options) ? options as string[] : [];
  };

  return (
    <div>
      <h1>{t('createCampaign')}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="section-title">{t('campaignDetails')}</div>
        <label>{t('campaignName')}</label>
        <input {...register('name')} />
        <label>{t('description')}</label>
        <textarea {...register('description')} />
        <label>{t('partner')}</label>
        <select {...register('partner')}>
          {role==="admin" && partners.map(partner => <option key={partner._id} value={partner._id}>{partner.partnerName}</option>)}
          {role==="partner" && partners.filter(partner => partner._id == userId).map(partner => <option key={partner._id} value={partner._id}>{partner.partnerName}</option>)}
        </select>
        <label>{t('Video')}</label>
        <select {...register('activityType')}>
          {getOptions('activityTypes').map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <label>{t('startDate')}</label>
        <input type="date" {...register('startDate')} />
        <label>{t('endDate')}</label>
        <input type="date" {...register('endDate')} />
        <div className="section-title">{t('userTargeting')}</div>
        <label>{t('ageRange')}</label>
        <div className="min-max-inputs">
          <input type="number" {...register('ageMin')} placeholder={t('minAge')} />
          <input type="number" {...register('ageMax')} placeholder={t('maxAge')} />
        </div>
        <label>{t('country')}</label>
        <select {...register('country')}>
          {getOptions('countries').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>{t('city')}</label>
        <select {...register('city')}>
          {getOptions('cities').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>{t('employmentStatus')}</label>
        <select {...register('employmentStatus')}>
          {getOptions('employmentStatuses').map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label>{t('educationLevel')}</label>
        <select {...register('educationLevel')}>
          {getOptions('educationLevels').map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label>{t('salaryRange')}</label>
        <div className="min-max-inputs">
          <input type="number" {...register('salaryMin')} placeholder={t('minSalary')} />
          <input type="number" {...register('salaryMax')} placeholder={t('maxSalary')} />
        </div>
        <label>{t('maritalStatus')}</label>
        <select {...register('maritalStatus')}>
          {getOptions('maritalStatuses').map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <label>{t('kidsNoKids')}</label>
        <select {...register('kidsNoKids')}>
          {getOptions('kidsOptions').map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <div className="section-title">{t('rewards')}</div>
        <label>{t('rewardAmount')}</label>
        <input type="number" {...register('rewardAmount')} />
        <div className="section-title">{t('budgetAndLimit')}</div>
        <label>{t('totalBudget')}</label>
        <input type="number" {...register('totalBudget')} />
        <label>{t('costPerUser')}</label>
        <input type="number" {...register('costPerUser')} />
        <label>{t('numberOfUsers')}</label>
        <input type="number" {...register('numberOfUsers')} />
        <div className="section-title">{t('content')}</div>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>{t('dragOrBrowse')}</p>
              <button className="secondary">{t('browse', { defaultValue: 'Browse' })}</button>
              {video && <p>{t('selected', { defaultValue: 'Selected' })}: {video.name}</p>}
            </div>
          )}
        </Dropzone>
        <label>{t('surveyLink')}</label>
        <input {...register('survey')} placeholder={t('enterSurveyLink', { defaultValue: 'Enter survey link' })} />
        <button className="primary" type="submit">{t('create')}</button>
      </form>
    </div>
  );
};

export default CreateCampaign;
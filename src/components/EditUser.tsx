import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Spinner from "./Spinner";

const EditUser: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // Start loading
        const res = await axios.get(`/api/admins/users/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        const user = res.data;

        // Calculate rewards correctly: sum of completed transactions' rewards
        let rewards = 0;
        user.transactions?.forEach((tx: any) => {
          if (tx.status?.toLowerCase() === "completed") {
            rewards += tx.campaign?.rewardAmount || 0;
          }
        });

        // Set all values, keeping field names consistent with userDetail.tsx
        setValue('lastName', user.lastName || '');
        setValue('firstName', user.firstName || '');
        setValue('email', user.email || '');
        setValue('phone', user.phone || '');
        setValue('dateOfBirth', user.dateOfBirth?.split('T')[0] || '');
        setValue('gender', user.gender?.charAt(0).toUpperCase() + user.gender?.slice(1) || '');
        setValue('country', user.country || '');
        setValue('city', user.city || '');
        setValue('employmentStatus', user.employmentStatus?.charAt(0).toUpperCase() + user.employmentStatus?.slice(1) || '');
        setValue('educationLevel', user.educationLevel || '');
        setValue('salaryRangeMin', user.salaryRangeMin || '');
        setValue('salaryRangeMax', user.salaryRangeMax || '');
        setValue('maritalStatus', user.maritalStatus?.toLowerCase() || '');
        setValue('kidsNoKids', (user.hasKids || user.hasKids==="true") ? "Yes" : "No");
        setValue('rewards', rewards);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axios.patch(`/api/admins/users/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` } });
      navigate('/users');
    } catch (err) {
      alert(t('updateFailed', { defaultValue: 'Update failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span style={{ cursor: "pointer", color: "orange" }} onClick={() => navigate("/users")}>
        {t("Users")}
      </span>{" "}
      <span style={{ cursor: "pointer", color: "orange" }} onClick={() => navigate(-1)}>/ {t("userDetails")}
      </span>{" "}
      / {t("editUserDetails")}
      <h1>{t('editUserDetails', { defaultValue: 'Edit User Details' })}</h1>
      {loading ? <Spinner /> : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="section-title">{t('userProfileDetails')}</div>

        <label>{t('lastName', { defaultValue: 'Last Name' })}</label>
        <input {...register('lastName')} />

        <label>{t('firstName', { defaultValue: 'First Name' })}</label>
        <input {...register('firstName')} />

        <label>{t('email')}</label>
        <input {...register('email')} />

        <label>{t('phone')}</label>
        <input {...register('phone')} />

        <label>{t('dateOfBirth', { defaultValue: 'Date of Birth' })}</label>
        <input type="date" {...register('dateOfBirth')} />

        <label>{t('gender', { defaultValue: 'Gender' })}</label>
        <select {...register('gender')}>
          <option value="Male">{t('male', { defaultValue: 'Male' })}</option>
          <option value="Female">{t('female', { defaultValue: 'Female' })}</option>
        </select>

        <div className="section-title">{t('targetingData')}</div>

        <label>{t('country')}</label>
        <select {...register('country')}>
          {(t('countries', { returnObjects: true }) as string[]).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label>{t('city')}</label>
        <input {...register('city')} />

        <label>{t('employmentStatus')}</label>
        <input {...register('employmentStatus')} />

        <label>{t('educationLevel')}</label>
        <input {...register('educationLevel')} />

        <label>{t('salaryRange')}</label>
        <div className="min-max-inputs">
          <input type="number" {...register('salaryRangeMin')} placeholder={t('minSalary')} />
          <input type="number" {...register('salaryRangeMax')} placeholder={t('maxSalary')} />
        </div>

        <label>{t('maritalStatus')}</label>
        <select {...register('maritalStatus')}>
          {(t('maritalStatuses', { returnObjects: true }) as string[]).map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
        </select>

        <label>{t('kidsNoKids')}</label>
        <select {...register('hasKids')}>
          <option value="true">{t('Yes')}</option>
          <option value="false">{t('No')}</option>
        </select>

        <div className="section-title">{t('rewards')}</div>
        <label>{t('totalCash', { defaultValue: 'Total Cash' })}</label>
        <input type="number" {...register('rewards')} readOnly />

        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/users')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default EditUser;

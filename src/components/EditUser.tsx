import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const EditUser: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admins/users/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        const user = res.data;
        
        let rewards = 0;
        user.Transactions?.map((tx: any) => {
          rewards += tx.status? 0 : tx.Campaign?.rewardAmount || 0;        
        });

        console.log(user.kidsNoKids);

        setValue('lastName', user.lastName);
        setValue('firstName', user.firstName);
        setValue('email', user.email);
        setValue('phone', user.phone);
        setValue('dateOfBirth', user.dateOfBirth);
        setValue('gender', user.gender.charAt(0).toUpperCase()+user.gender.slice(1));
        setValue('country', user.country);
        setValue('city', user.city);
        setValue('employmentStatus', user.employmentStatus.charAt(0).toUpperCase() + user.employmentStatus.slice(1));
        setValue('educationLevel', user.educationLevel);
        setValue('salaryMin', user.salaryRangeMin);
        setValue('salaryMax', user.salaryRangeMax);
        setValue('maritalStatus', user.maritalStatus.charAt(0).toUpperCase() + user.maritalStatus.slice(1));
        setValue('kidsNoKids', user.kidsNoKids?"Yes":"No");
        setValue('rewards', rewards);
        // Transactions not editable here
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await axios.patch(`/api/admins/users/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` } });
      navigate('/users');
    } catch (err) {
      alert(t('updateFailed', { defaultValue: 'Update failed' }));
    }
  };

  return (
    <div>
      <h1>{t('editUserDetails', { defaultValue: 'Edit User Details' })}</h1>
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
        <select {...register('employmentStatus')}>
          {(t('employmentStatuses', { returnObjects: true }) as string[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label>{t('educationLevel')}</label>
        <select {...register('educationLevel')}>
          {(t('educationLevels', { returnObjects: true }) as string[]).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label>{t('salaryRange')}</label>
        <div className="min-max-inputs">
          <input type="number" {...register('salaryMin')} placeholder={t('minSalary')} />
          <input type="number" {...register('salaryMax')} placeholder={t('maxSalary')} />
        </div>
        <label>{t('maritalStatus')}</label>
        <select {...register('maritalStatus')}>
          {(t('maritalStatuses', { returnObjects: true }) as string[]).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <label>{t('kidsNoKids')}</label>
        <select {...register('kidsNoKids')}>
          {(t('kidsOptions', { returnObjects: true }) as string[]).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <div className="section-title">{t('rewards')}</div>
        <label>{t('totalCash', { defaultValue: 'Total Cash' })}</label>
        <input type="number" {...register('rewards')} />
        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/users')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default EditUser;
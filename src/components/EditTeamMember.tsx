import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

const EditTeamMember: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`/api/admins/team/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        const member = res.data;
        setValue('firstName', member.firstName);
        setValue('lastName', member.lastName);
        setValue('email', member.email);
        setValue('phone', member.phone);
        setValue('title', member.title);
        setValue('country', member.country);
        setValue('city', member.city);
        setValue('role', member.role);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMember();
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await axios.patch(`/api/admins/team/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` } });
      navigate('/team-members');
    } catch (err) {
      alert(t('updateFailed'));
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(`/api/admins/team/${id}/reset-password`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
      alert(t('passwordResetSent', { defaultValue: 'Password reset sent' }));
    } catch (err) {
      alert(t('resetError'));
    }
  };

  return (
    <div>
      <h1>{t('editTeamMember', { defaultValue: 'Edit Team Member' })}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('firstName')}</label>
        <input {...register('firstName')} />
        <label>{t('lastName')}</label>
        <input {...register('lastName')} />
        <label>{t('email')}</label>
        <input {...register('email')} />
        <label>{t('phone')}</label>
        <input {...register('phone')} />
        <label>{t('title')}</label>
        <input {...register('title')} />
        <label>{t('country')}</label>
        <select {...register('country')}>
          {(t('countries', { returnObjects: true }) as string[]).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>{t('city')}</label>
        <input {...register('city')} />
        <label>{t('role')}</label>
        <select {...register('role')}>
          {(t('roles', { returnObjects: true }) as string[]).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="secondary" type="button" onClick={handleResetPassword}>{t('resetPassword', { defaultValue: 'Reset Password' })}</button>
        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/team-members')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default EditTeamMember;
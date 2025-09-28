import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTeamMember: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/api/admins/team', data);
      navigate('/team-members');
    } catch (err) {
      alert(t('addFailed'));
    }
  };

  return (
    <div>
      <h1>{t('addNewTeamMember')}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('firstName', { defaultValue: 'First Name' })}</label>
        <input {...register('firstName')} />
        <label>{t('lastName', { defaultValue: 'Last Name' })}</label>
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
        <label>{t('temporaryPassword')}</label>
        <input {...register('temporaryPassword')} />
        <input type="checkbox" {...register('sendResetLink')} />
        <label>{t('sendResetLink')}</label>
        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/team-members')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default AddTeamMember;
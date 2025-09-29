import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMobileProvider: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/api/admins/providers', data);
      navigate('/mobile-providers');
    } catch (err) {
      alert(t('addFailed'));
    }
  };

  return (
    <div>
      <h1>{t('addNewMobileProvider', { defaultValue: 'Add New Mobile Provider' })}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('cashAmount')}</label>
        <input type="number" {...register('balance')} />
        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/mobile-providers')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default AddMobileProvider;
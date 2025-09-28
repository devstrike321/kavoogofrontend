import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPartner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {

      if(data.cPassword !== data.password){
        alert("Password and Confirm Password do not match");
        return;
      }

      await axios.post('/api/admins/partners', data);
      navigate('/partners');
    } catch (err) {
      alert(t('addFailed', { defaultValue: 'Add failed' }));
    }
  };

  return (
    <div>
      <h1>{t('addNewPartner')}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('partnerName')}</label>
        <input {...register('partnerName')} />
        <label>{t('industry')}</label>
        <select {...register('industry')}>
          {(t('industries', { returnObjects: true }) as string[]).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <label>{t('country')}</label>
        <select {...register('country')}>
          {(t('countries', { returnObjects: true }) as string[]).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>{t('status')}</label>
        <select {...register('status')}>
          <option value="Active">{t('active')}</option>
          <option value="Inactive">{t('inactive')}</option>
        </select>
        <label>{t('contactPerson')}</label>
        <input {...register('contactPerson')} />
        <label>{t('email')}</label>
        <input {...register('email')} />
        <label>{t('phoneNumber')}</label>
        <input {...register('phoneNumber')} />
        <label>{t('Confirm Password')}</label>
        <input {...register('cPassword')} />
        <label>{t('Password')}</label>
        <input {...register('password')} />
        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/partners')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default AddPartner;
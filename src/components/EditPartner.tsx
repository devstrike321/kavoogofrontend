import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from "./Spinner";

const EditPartner: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admins/partners/${id}`);
        const partner = res.data;

        setValue('partnerName', partner.partnerName);
        setValue('country', partner.country);
        setValue('status', partner.status.charAt(0).toUpperCase() + partner.status.slice(1));
        setValue('contactPerson', partner.contactPerson);
        setValue('email', partner.email);
        setValue('phone', partner.phone);
        setValue('industry', partner.industry.charAt(0).toUpperCase() + partner.industry.slice(1) );
        setValue('password', partner.password);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axios.patch(`/api/admins/partners/${id}`, data);
      navigate('/partners');
    } catch (err) {
      alert(t('updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span style={{cursor:"pointer", color:"orange"}} onClick={()=>navigate("/partners")}>{t("partners")} </span>
      {" "}
      <span style={{cursor:"pointer", color:"orange"}} onClick={()=>navigate(-1)}>/ {t("partnerDetails")} </span>
      {" "}
      <span> / {t('editPartnerDetails', { defaultValue: 'Edit Partner Details' })}</span>
      <h1>{t('editPartnerDetails', { defaultValue: 'Edit Partner Details' })}</h1>
      {loading && <Spinner />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('partnerName')}</label>
        <input {...register('partnerName')} />
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
        <label>{t('phone')}</label>
        <input {...register('phone')} />
        <label>{t('industry')}</label>
        <select {...register('industry')}>
          {(t('industries', { returnObjects: true }) as string[]).map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <button className="primary" type="submit">{t('save')}</button>
        <button className="secondary" type="button" onClick={() => navigate('/partners')}>{t('cancel')}</button>
      </form>
    </div>
  );
};

export default EditPartner;

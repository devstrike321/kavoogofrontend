import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FormData = { email: string };

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/admins/forgot-password', data); // Assume endpoint
      alert(t('resetSent', { defaultValue: 'Reset link sent' }));
      navigate('/login');
    } catch (err) {
      alert(t('resetError', { defaultValue: 'Error sending reset link' }));
    }
  };

  return (
    <div className="forgot-container">
      <img src="/logo1.png" alt="Logo" className="logo-large" />
      <h1>{t('forgotPassword')}</h1>
      <p>{t('enterEmailReset', { defaultValue: 'Enter your email address and we\'ll send you a link to reset your password.' })}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('email')}</label>
        <input {...register('email')} placeholder={t('enterEmail', { defaultValue: 'Enter your email' })} />
        <button className="primary" type="submit">{t('sendResetLink', { defaultValue: 'Send Reset Link' })}</button>
      </form>
      <button className="secondary" onClick={() => navigate('/login')}>{t('backToLogin', { defaultValue: 'Back to Login' })}</button>
    </div>
  );
};

export default ForgotPassword;
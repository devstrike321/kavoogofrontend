import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice';

type FormData = { email: string; password: string };

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/api/admins/login', data);
      dispatch(loginSuccess(res.data.token));
      navigate('/dashboard');
    } catch (err) {
      alert(t('loginFailed', { defaultValue: 'Login failed' }));
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="Logo" className="logo-large" />
      <h1>{t('login')}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>{t('email')}</label>
        <input {...register('email')} placeholder={t('enterEmail', { defaultValue: 'Enter your username or email' })} />
        <label>{t('password')}</label>
        <input type="password" {...register('password')} placeholder={t('enterPassword', { defaultValue: 'Enter your password' })} />
        <button className="primary" type="submit">{t('login')}</button>
      </form>
      <button className="secondary" onClick={() => navigate('/forgot-password')}>{t('forgotPassword')}</button>
    </div>
  );
};

export default Login;
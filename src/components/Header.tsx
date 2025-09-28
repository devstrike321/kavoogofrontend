import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div>
        <img src="/logo.png" alt="Kavoo GO Logo" className="logo" />
        <span className="header-title">{t('headerTitle', { defaultValue: 'Kavoo GO' })}</span>
      </div>
      <div className="header-right">
        <button className={`lang-button ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>EN</button>
        <button className={`lang-button ${i18n.language === 'fr' ? 'active' : ''}`} onClick={() => changeLanguage('fr')}>FR</button>
        <button className="logout-button" onClick={handleLogout}>{t('logout')}</button>
      </div>
    </header>
  );
};

export default Header;
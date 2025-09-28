import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role);

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="sidebar">
      <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard')}`}>
        <span className="sidebar-icon">🏠</span> {t('dashboard')}
      </Link>
      <Link to="/users" className={`sidebar-item ${isActive('/users')}`}>
        <span className="sidebar-icon">👤</span> {t('users')}
      </Link>
      <Link to="/partners" className={`sidebar-item ${isActive('/partners')}`}>
        <span className="sidebar-icon">🤝</span> {t('partners')}
      </Link>
      <Link to="/campaigns" className={`sidebar-item ${isActive('/campaigns')}`}>
        <span className="sidebar-icon">📣</span> {t('campaigns')}
      </Link>
      <Link to="/transactions" className={`sidebar-item ${isActive('/transactions')}`}>
        <span className="sidebar-icon">💸</span> {t('transactions')}
      </Link>
      {role === 'admin' && (
        <>
          <Link to="/team-members" className={`sidebar-item ${isActive('/team-members')}`}>
            <span className="sidebar-icon">👥</span> {t('teamMembers')}
          </Link>
          <Link to="/mobile-providers" className={`sidebar-item ${isActive('/mobile-providers')}`}>
            <span className="sidebar-icon">📱</span> {t('mobileProviders')}
          </Link>
          <Link to="/rewards" className={`sidebar-item ${isActive('/rewards')}`}>
            <span className="sidebar-icon">🎁</span> {t('rewards')}
          </Link>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
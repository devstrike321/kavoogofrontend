import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role);
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="sidebar">
      <p onClick={()=>navigate("/dashboard")} className={`sidebar-item ${isActive('/dashboard')}`}>
        <span className="sidebar-icon">🏠</span> {t('dashboard')}
      </p>
      <p onClick={()=>navigate("/users")} className={`sidebar-item ${isActive('/users')}`}>
        <span className="sidebar-icon">👤</span> {t('users')}
      </p>
      <p onClick={()=>navigate("/partners")} className={`sidebar-item ${isActive('/partners')}`}>
        <span className="sidebar-icon">🤝</span> {t('partners')}
      </p>
      <p onClick={()=>navigate("/campaigns")} className={`sidebar-item ${isActive('/campaigns')}`}>
        <span className="sidebar-icon">📣</span> {t('campaigns')}
      </p>
      <p onClick={()=>navigate("/transactions")} className={`sidebar-item ${isActive('/transactions')}`}>
        <span className="sidebar-icon">💸</span> {t('transactions')}
      </p>
      {role === 'admin' && (
        <>
          <p onClick={()=>navigate("/team-members")} className={`sidebar-item ${isActive('/team-members')}`}>
            <span className="sidebar-icon">👥</span> {t('teamMembers')}
          </p>
          <p onClick={()=>navigate("/mobile-providers")} className={`sidebar-item ${isActive('/mobile-providers')}`}>
            <span className="sidebar-icon">📱</span> {t('mobileProviders')}
          </p>
          <p onClick={()=>navigate("/rewards")} className={`sidebar-item ${isActive('/rewards')}`}>
            <span className="sidebar-icon">🎁</span> {t('rewards')}
          </p>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
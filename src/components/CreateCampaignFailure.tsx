import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CreateCampaignFailure: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="failure-message">
      <h1>{t('campaignFailed')}</h1>
      <p>{t('campaignFailedMsg')}</p>
      <Link to="/campaigns" className="secondary">{t('backToCampaignsList')}</Link>
      <Link to="/create-campaign" className="primary">{t('retry')}</Link>
    </div>
  );
};

export default CreateCampaignFailure;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CreateCampaignSuccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="success-message">
      <h1>{t('campaignCreated')}</h1>
      <p>{t('campaignCreatedMsg')}</p>
      <Link to="/campaigns" className="secondary">{t('backToCampaignsList')}</Link>
      <Link to="/create-campaign" className="primary">{t('createAnotherCampaign')}</Link>
    </div>
  );
};

export default CreateCampaignSuccess;
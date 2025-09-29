import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CreateCampaignFailure: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="failure-message">
      <h1>{t('campaignFailed')}</h1>
      <p>{t('campaignFailedMsg')}</p>
      <button onClick={()=>navigate("/campaigns")} className="secondary">{t('backToCampaignsList')}</button>
      <button onClick={()=>navigate("/create-campaign")} className="primary">{t('retry')}</button>
    </div>
  );
};

export default CreateCampaignFailure;
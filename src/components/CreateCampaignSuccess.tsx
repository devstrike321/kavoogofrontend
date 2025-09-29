import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CreateCampaignSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="success-message">
      <h1>{t('campaignCreated')}</h1>
      <p>{t('campaignCreatedMsg')}</p>
      <button onClick={()=>navigate("/campaigns")} className="secondary">{t('backToCampaignsList')}</button>
      <button onClick={()=>navigate("/create-campaign")} className="primary">{t('createAnotherCampaign')}</button>
    </div>
  );
};

export default CreateCampaignSuccess;
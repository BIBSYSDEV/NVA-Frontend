import '../../styles/user.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

import ButtonModal from '../../components/ButtonModal';
import UserCard from './UserCard';

const UserOrcid: React.FC = () => {
  const { t } = useTranslation();

  const openORCID = () => {
    window.open(
      'https://sandbox.orcid.org/signin?oauth&client_id=0000-0002-1223-3173&response_type=code&scope=/authenticate&redirect_uri=http://localhost:3000',
      '_blank',
      'toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500, rel="noopener noreferrer"'
    );
  };

  return (
    <UserCard headerLabel={t('ORCID')} className="user__orcid-info">
      <ButtonModal
        buttonText={t('Create or Connect to your ORCID')}
        startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
        <div className="orcid-modal">
          <h5>{t('Registration')} 2/2</h5>
          <h3>{t('Create or Connect to your ORCID')}</h3>
          <p>{t('Log in to your ORCID account or create new ORCID account')}</p>
          <div className="orcid-button">
            <Button
              onClick={openORCID}
              variant="outlined"
              size="large"
              startIcon={
                <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />
              }>
              {t('Create or Connect to your ORCID')}
            </Button>
          </div>
          <b>
            <h4>{t('Why should I connect to ORCID?')}</h4>
          </b>
          <p>{t('description_why_ORCID')}</p>
          <b>
            <h4>{'What is ORCID?'}</h4>
          </b>
          <p>
            {t('description_what_is_ORCID')}
            <br />
            {t('Learn more at ')} <a href="https://orcid.org">orcid.org</a>
          </p>
          <div className="skip">
            <Link to="/">{t("Skip this step (can be configured in 'profile' later)")}</Link>
          </div>
        </div>
      </ButtonModal>
    </UserCard>
  );
};

export default UserOrcid;

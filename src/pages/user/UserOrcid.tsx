import '../../styles/pages/user.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Button } from '@material-ui/core';

import ButtonModal from '../../components/ButtonModal';
import { RootStore } from '../../redux/reducers/rootReducer';
import { useMockData } from '../../utils/constants';
import UserCard from './UserCard';

const UserOrcid: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const user = useSelector((state: RootStore) => state.user);

  const openORCID = () => {
    if (useMockData) {
      history.push('/user?code=123456');
    } else {
      window.open(
        'https://sandbox.orcid.org/signin?oauth&client_id=0000-0002-1223-3173&response_type=code&scope=/authenticate&redirect_uri=http://localhost:3000',
        '_blank',
        'toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500, rel="noopener noreferrer"'
      );
    }
  };

  return (
    <UserCard headerLabel={t('ORCID')} className="orcid-info">
      {user.orcid ? (
        <div className="line">
          <div className="label">{t('Your ORCID')}:</div>
          <div className="text">
            <a data-testid="orcid-info" href={`https://orcid.org/${user.orcid}`}>{`https://orcid.org/${user.orcid}`}</a>
          </div>
        </div>
      ) : (
        <ButtonModal
          buttonText={t('Create or Connect to your ORCID')}
          dataTestId="open-orcid-modal"
          startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
          {({ setOpen }: any) => (
            <div className="orcid-modal">
              <h5>{t('Registration')} 2/2</h5>
              <h3>{t('Create or Connect to your ORCID')}</h3>
              <p>{t('Log in to your ORCID account or create new ORCID account')}</p>
              <div className="orcid-button">
                <Button
                  data-testid="connect-to-orcid"
                  onClick={() => {
                    openORCID();
                    setOpen(false);
                  }}
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
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}>
                  {t("Skip this step (can be configured in 'profile' later)")}
                </Button>
              </div>
            </div>
          )}
        </ButtonModal>
      )}
    </UserCard>
  );
};

export default UserOrcid;

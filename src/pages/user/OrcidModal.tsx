import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { ORCID_SIGN_IN_URL, USE_MOCK_DATA } from '../../utils/constants';

const StyledButtonHolder = styled.div`
  margin: 3rem 0;
  text-align: center;
`;

const StyledNavigationHelp = styled.div`
  border-bottom: 1px solid black;
  text-align: right;
  font-size: 0.8rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.2rem;
  margin: 1em 0;
  font-weight: bold;
`;

const StyledSubHeading = styled.div`
  margin: 1em 0;
  font-weight: bold;
`;

const StyledFooter = styled.div`
  padding-top: 5rem;
  text-align: center;
`;

interface OrcidModalProps {
  setOpen: (value: boolean) => void;
}

const OrcidModal: React.FC<OrcidModalProps> = ({ setOpen }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const openORCID = () => {
    if (USE_MOCK_DATA) {
      history.push('/user?code=123456');
    } else {
      window.open(
        ORCID_SIGN_IN_URL,
        '_blank',
        'toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500, rel="noopener noreferrer"'
      );
    }
  };

  return (
    <div>
      <StyledNavigationHelp>{t('profile:orcid.registration')} 2/2</StyledNavigationHelp>
      <StyledHeading>{t('profile:orcid.create_or_connect')}</StyledHeading>
      <p>{t('profile:orcid.login')}</p>
      <StyledButtonHolder>
        <Button
          data-testid="connect-to-orcid"
          onClick={() => {
            openORCID();
            setOpen(false);
          }}
          variant="outlined"
          size="large"
          startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
          {t('profile:orcid.create_or_connect')}
        </Button>
      </StyledButtonHolder>
      <StyledSubHeading>{t('profile:orcid.why')}</StyledSubHeading>
      <p>{t('profile:orcid.description_why_use_orcid')}</p>
      <StyledSubHeading>{'profile:orcid.what'}</StyledSubHeading>
      <p>{t('profile.orcid:description_what_is_orcid')}</p>
      <p>
        {t('profile:orcid.learn_more')} <a href="https://orcid.org">orcid.org</a>
      </p>
      <StyledFooter>
        <Button
          onClick={() => {
            setOpen(false);
          }}>
          {t('profile:orcid.skip_this_step')}
        </Button>
      </StyledFooter>
    </div>
  );
};

export default OrcidModal;

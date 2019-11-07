import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { useMockData } from '../../utils/constants';
import { useHistory } from 'react-router';

const StyledOrcidButtonHolder = styled.div`
  margin: 3rem 0;
  text-align: center;
`;

const StyledNavigationHelp = styled.div`
  border-bottom: 1px solid black;
  text-align: right;
  font-size: 0.8rem;
  font-weight: bold;
`;

const StyledHeader = styled.div`
  font-size: 1.2rem;
  margin: 1em 0;
  font-weight: bold;
`;

const StyledSubHeader = styled.div`
  margin: 1em 0;
  font-weight: bold;
`;

const StyledFooter = styled.div`
  padding-top: 5rem;
  text-align: center;
`;

interface OrcidModalProps {
  setOpen: any;
}

const OrcidModal: React.FC<OrcidModalProps> = ({ setOpen }) => {
  const { t } = useTranslation();
  const history = useHistory();

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
    <div className="orcid-modal">
      <StyledNavigationHelp>{t('Registration')} 2/2</StyledNavigationHelp>
      <StyledHeader>{t('Create or Connect to your ORCID')}</StyledHeader>
      <p>{t('Log in to your ORCID account or create new ORCID account')}</p>
      <StyledOrcidButtonHolder>
        <Button
          data-testid="connect-to-orcid"
          onClick={() => {
            openORCID();
            setOpen(false);
          }}
          variant="outlined"
          size="large"
          startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
          {t('Create or Connect to your ORCID')}
        </Button>
      </StyledOrcidButtonHolder>
      <StyledSubHeader>{t('Why should I connect to ORCID?')}</StyledSubHeader>
      <p>{t('description_why_ORCID')}</p>
      <StyledSubHeader>{'What is ORCID?'}</StyledSubHeader>
      <p>{t('description_what_is_ORCID')}</p>
      <p>
        {t('Learn more at ')} <a href="https://orcid.org">orcid.org</a>
      </p>
      <StyledFooter>
        <Button
          onClick={() => {
            setOpen(false);
          }}>
          {t("Skip this step (can be configured in 'profile' later)")}
        </Button>
      </StyledFooter>
    </div>
  );
};

export default OrcidModal;

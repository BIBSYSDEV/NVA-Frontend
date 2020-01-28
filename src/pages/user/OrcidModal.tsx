import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { ORCID_SIGN_IN_URL, USE_MOCK_DATA } from '../../utils/constants';

const StyledButtonContainer = styled.div`
  margin: 3rem 0;
  text-align: center;
`;

const StyledSubHeading = styled.div`
  margin: 1em 0;
  font-weight: bold;
`;

const StyledOrcidDescription = styled.div`
  padding: 0.5rem;
`;

const OrcidModal: FC = () => {
  const { t } = useTranslation('profile');
  const history = useHistory();

  const openORCID = () => {
    if (USE_MOCK_DATA) {
      history.push('/user/#access_token=12343123');
    } else {
      window.open(
        ORCID_SIGN_IN_URL,
        '_blank',
        'toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500, rel="noopener noreferrer"'
      );
    }
  };

  return (
    <>
      <StyledOrcidDescription>
        <p>{t('orcid.login')}</p>
        <StyledSubHeading>{t('orcid.why')}</StyledSubHeading>
        <p>{t('orcid.description_why_use_orcid')}</p>
        <StyledSubHeading>{'orcid.what'}</StyledSubHeading>
        <p>{t('orcid.description_what_is_orcid')}</p>
      </StyledOrcidDescription>
      <StyledButtonContainer>
        <Button
          data-testid="connect-to-orcid"
          onClick={() => {
            openORCID();
          }}
          color="primary"
          variant="contained">
          {t('orcid.create_or_connect')}
        </Button>
      </StyledButtonContainer>
    </>
  );
};

export default OrcidModal;

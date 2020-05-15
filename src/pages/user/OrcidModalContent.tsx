import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Button, DialogContent, DialogActions } from '@material-ui/core';

import { ORCID_SIGN_IN_URL, USE_MOCK_DATA } from '../../utils/constants';
import NormalText from '../../components/NormalText';
import Label from '../../components/Label';

const StyledButtonContainer = styled(DialogActions)`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const StyledButton = styled(Button)`
  width: 22rem;
`;

const StyledSubHeading = styled(Label)`
  margin: 1em 0;
  font-weight: bold;
`;

const StyledOrcidDescription = styled(DialogContent)`
  padding: 0.5rem;
`;

const OrcidModalContent: FC = () => {
  const { t } = useTranslation('profile');
  const history = useHistory();

  const openORCID = () => {
    if (USE_MOCK_DATA) {
      history.push('/user/#access_token=12343123');
    } else {
      window.location.assign(ORCID_SIGN_IN_URL);
    }
  };

  return (
    <>
      <StyledOrcidDescription dividers>
        <NormalText>{t('orcid.login')}</NormalText>
        <StyledSubHeading>{t('orcid.why')}</StyledSubHeading>
        <NormalText>{t('orcid.description_why_use_orcid')}</NormalText>
        <StyledSubHeading>{t('orcid.what')}</StyledSubHeading>
        <NormalText>{t('orcid.description_what_is_orcid')}</NormalText>
      </StyledOrcidDescription>
      <StyledButtonContainer>
        <StyledButton
          data-testid="connect-to-orcid"
          onClick={() => {
            openORCID();
          }}
          color="primary"
          variant="contained">
          {t('orcid.create_or_connect')}
        </StyledButton>
      </StyledButtonContainer>
    </>
  );
};

export default OrcidModalContent;

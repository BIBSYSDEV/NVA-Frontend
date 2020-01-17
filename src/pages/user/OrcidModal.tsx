import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Button, Link } from '@material-ui/core';

import { ORCID_SIGN_IN_URL, USE_MOCK_DATA } from '../../utils/constants';

const StyledButtonHolder = styled.div`
  margin: 3rem 0;
  text-align: center;
`;

const StyledSubHeading = styled.div`
  margin: 1em 0;
  font-weight: bold;
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
      <p>{t('orcid.login')}</p>
      <StyledButtonHolder>
        <Button
          data-testid="connect-to-orcid"
          onClick={() => {
            openORCID();
          }}
          variant="outlined"
          size="large"
          startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
          {t('orcid.create_or_connect')}
        </Button>
      </StyledButtonHolder>
      <StyledSubHeading>{t('orcid.why')}</StyledSubHeading>
      <p>{t('orcid.description_why_use_orcid')}</p>
      <StyledSubHeading>{'orcid.what'}</StyledSubHeading>
      <p>{t('orcid.description_what_is_orcid')}</p>
      <p>
        {t('orcid.learn_more')} <Link href="https://orcid.org">orcid.org</Link>
      </p>
    </>
  );
};

export default OrcidModal;

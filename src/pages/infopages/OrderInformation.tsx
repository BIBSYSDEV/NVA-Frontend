import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';
import { Link as MuiLink } from '@material-ui/core';

import Card from '../../components/Card';
import { ContactInformation } from '../../utils/constants';
import { InformationWrapper } from '../../components/styled/Wrappers1';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const StyledNormalText = styled(NormalText)`
  padding-top: 1rem;
`;

const OrderInformation: FC = () => {
  const { t } = useTranslation('infopages');

  return (
    <InformationWrapper data-testid="order-information" aria-label={t('order_information.heading')}>
      <Card>
        <StyledHeading>{t('order_information.heading')}</StyledHeading>
        <NormalText>{t('order_information.description')}</NormalText>

        <StyledNormalText>
          <Trans i18nKey="infopages:order_information.links">
            <MuiLink href={`https://${ContactInformation.NVA_TEST_WEBSITE}`} target="_blank" rel="noopener noreferrer">
              {{ website: ContactInformation.NVA_TEST_WEBSITE }}
            </MuiLink>
            <MuiLink href={`mailto:${ContactInformation.NVA_EMAIL}`} target="_blank" rel="noopener noreferrer">
              {{ mailto: ContactInformation.NVA_EMAIL }}
            </MuiLink>
          </Trans>
        </StyledNormalText>
      </Card>
    </InformationWrapper>
  );
};

export default OrderInformation;

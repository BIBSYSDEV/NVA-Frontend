import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';
import { Link as MuiLink } from '@material-ui/core';

import Card from '../../components/Card';
import { ContactInformation } from '../../utils/constants';

const StyledInformationWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  padding-top: 4rem;
  padding-bottom: 1rem;
`;

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const OrderInformation: FC = () => {
  const { t } = useTranslation('common');

  return (
    <StyledInformationWrapper data-testid="order-information" aria-label={t('order_information_heading')}>
      <Card>
        <StyledHeading>{t('order_information_heading')}</StyledHeading>
        <NormalText>{t('order_information_description')}</NormalText>
        <br />
        <NormalText>
          <Trans i18nKey="common:order_information_links">
            <MuiLink href={`https://${ContactInformation.NVA_TEST_WEBSITE}`} target="_blank" rel="noopener noreferrer">
              {{ website: ContactInformation.NVA_TEST_WEBSITE }}
            </MuiLink>
            <MuiLink href={`mailto:${ContactInformation.NVA_EMAIL}`} target="_blank" rel="noopener noreferrer">
              {{ mailto: ContactInformation.NVA_EMAIL }}
            </MuiLink>
          </Trans>
        </NormalText>
      </Card>
    </StyledInformationWrapper>
  );
};

export default OrderInformation;

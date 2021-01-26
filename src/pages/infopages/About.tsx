import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { Typography, Link as MuiLink } from '@material-ui/core';
import { ContactInformation } from '../../utils/constants';

const StyledAboutContainer = styled.div`
  display: block;

  ul {
    margin-top: 0;
  }
`;

const About = () => {
  const { t } = useTranslation('about');

  return (
    <>
      <PageHeader>{t('about_heading')}</PageHeader>
      <StyledAboutContainer>
        <Typography variant="h2">{t('description.heading')}</Typography>
        <Typography>{t('description.paragraph0.intro')}</Typography>
        <ul>
          <Typography component="li">{t('description.paragraph0.bullet_point0')}</Typography>
          <Typography component="li">{t('description.paragraph0.bullet_point1')}</Typography>
        </ul>

        <Typography paragraph>{t('description.paragraph1')}</Typography>
        <Typography paragraph>{t('description.paragraph2')}</Typography>
        <Typography paragraph>{t('description.paragraph3')}</Typography>
        <Typography paragraph>{t('description.paragraph4')}</Typography>
        <Typography paragraph>
          <Trans t={t} i18nKey="description.paragraph5">
            <MuiLink href={`mailto:${ContactInformation.UNIT_SUPPORT_EMAIL}`} target="_blank" rel="noopener noreferrer">
              {ContactInformation.UNIT_SUPPORT_EMAIL}
            </MuiLink>
          </Trans>
        </Typography>

        <Typography variant="h2">{t('order_information.heading')}</Typography>
        <Typography paragraph>{t('order_information.paragraph0')}</Typography>
        <Typography>
          <Trans t={t} i18nKey="order_information.paragraph1">
            <MuiLink href={`https://${ContactInformation.NVA_TEST_WEBSITE}`} target="_blank" rel="noopener noreferrer">
              {ContactInformation.NVA_TEST_WEBSITE}
            </MuiLink>
            <MuiLink href={`mailto:${ContactInformation.NVA_EMAIL}`} target="_blank" rel="noopener noreferrer">
              {ContactInformation.NVA_EMAIL}
            </MuiLink>
          </Trans>
        </Typography>
      </StyledAboutContainer>
    </>
  );
};

export default About;

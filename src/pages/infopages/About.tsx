import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Link as MuiLink, Typography } from '@material-ui/core';
import BackgroundDiv from '../../components/BackgroundDiv';
import { PageHeader } from '../../components/PageHeader';
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
    <BackgroundDiv>
      <PageHeader>{t('about_heading')}</PageHeader>
      <StyledAboutContainer>
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
              (i18n content: support email)
            </MuiLink>
          </Trans>
        </Typography>
      </StyledAboutContainer>
    </BackgroundDiv>
  );
};

export default About;

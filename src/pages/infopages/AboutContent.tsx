import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link as MuiLink, Typography } from '@material-ui/core';
import { ContactInformation } from '../../utils/constants';

const AboutContent = () => {
  const { t } = useTranslation('about');

  return (
    <>
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
    </>
  );
};

export default AboutContent;

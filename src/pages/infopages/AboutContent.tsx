import { Trans, useTranslation } from 'react-i18next';
import { Link as MuiLink, Typography } from '@mui/material';

export const AboutContent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography>{t('about.description.paragraph0.intro')}</Typography>
      <ul>
        <Typography component="li">{t('about.description.paragraph0.bullet_point0')}</Typography>
        <Typography component="li">{t('about.description.paragraph0.bullet_point1')}</Typography>
      </ul>

      <Typography paragraph>{t('about.description.paragraph1')}</Typography>
      <Typography paragraph>{t('about.description.paragraph2')}</Typography>
      <Typography paragraph>{t('about.description.paragraph3')}</Typography>
      <Typography paragraph>{t('about.description.paragraph4')}</Typography>
      <Typography paragraph>
        <Trans t={t} i18nKey="about.description.paragraph5">
          <MuiLink href={'mailto:support@sikt.no'} target="_blank" rel="noopener noreferrer">
            (i18n content: support email)
          </MuiLink>
        </Trans>
      </Typography>
    </>
  );
};

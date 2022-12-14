import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { AboutContent } from './AboutContent';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <StyledPageContent>
      <PageHeader>{t('common.about_nva')}</PageHeader>
      <Typography paragraph>{t('about.short_description')}</Typography>
      <AboutContent />
    </StyledPageContent>
  );
};

export default AboutPage;

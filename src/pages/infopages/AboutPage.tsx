import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { AboutContent } from './AboutContent';

const AboutPage = () => {
  const { t } = useTranslation('common');

  return (
    <SyledPageContent>
      <PageHeader>{t('about_nva')}</PageHeader>
      <Typography paragraph>{t('about:short_description')}</Typography>
      <AboutContent />
    </SyledPageContent>
  );
};

export default AboutPage;

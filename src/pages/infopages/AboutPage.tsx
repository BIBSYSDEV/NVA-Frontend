import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { AboutContent } from './AboutContent';

const AboutPage = () => {
  const { t } = useTranslation('common');
  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('about_nva')}</PageHeader>
      <Typography paragraph>{t('about:short_description')}</Typography>
      <AboutContent />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default AboutPage;

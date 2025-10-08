import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { LocalStorageKey } from '../../utils/constants';
import { CategorySection } from './CategorySection';
import { FrontPageHeading } from './FrontPageHeading';
import { NvaDescriptionSection } from './NvaDescriptionSection';
import { SearchSection } from './SearchSection';
import { HeadTitle } from '../../components/HeadTitle';
import { Box } from '@mui/material';

const FrontPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const loginPath = localStorage.getItem(LocalStorageKey.RedirectPath);
    if (loginPath) {
      localStorage.removeItem(LocalStorageKey.RedirectPath);
      navigate(loginPath, { replace: true });
    }
  }, [navigate]);

  return (
    <StyledPageContent
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: '0.75rem', sm: '2rem' } }}>
      <HeadTitle>{t('common.start_page')}</HeadTitle>
      <Box sx={{ width: '100%' }}>
        <FrontPageHeading />
        <SearchSection />
      </Box>
      <NvaDescriptionSection />
      <CategorySection />
    </StyledPageContent>
  );
};

export default FrontPage;

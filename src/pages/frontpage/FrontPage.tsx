import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { LocalStorageKey } from '../../utils/constants';
import { CategorySection } from './CategorySection';
import { FrontPageHeading } from './FrontPageHeading';
import { NvaDescriptionSection } from './NvaDescriptionSection';
import { SearchSection } from './SearchSection';

const FrontPage = () => {
  const navigate = useNavigate();

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
      <FrontPageHeading />
      <SearchSection />
      <NvaDescriptionSection />
      <CategorySection />
    </StyledPageContent>
  );
};

export default FrontPage;

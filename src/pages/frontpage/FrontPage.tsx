import { FrontPageHeading } from './FrontPageHeading';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { SearchSection } from './SearchSection';
import { NvaDescriptionSection } from './NvaDescriptionSection';
import { CategorySection } from './CategorySection';

const FrontPage = () => (
  <StyledPageContent
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: '0.75rem', sm: '2rem' } }}>
    <FrontPageHeading />
    <SearchSection />
    <NvaDescriptionSection />
    <CategorySection />
  </StyledPageContent>
);

export default FrontPage;

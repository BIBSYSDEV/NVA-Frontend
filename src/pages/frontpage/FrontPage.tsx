import { FrontPageHeading } from './FrontPageHeading';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { SearchSection } from './SearchSection';
import { NvaDescriptionSection } from './NvaDescriptionSection';

const FrontPage = () => (
  <StyledPageContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
    <FrontPageHeading />
    <SearchSection />
    <NvaDescriptionSection />
  </StyledPageContent>
);

export default FrontPage;

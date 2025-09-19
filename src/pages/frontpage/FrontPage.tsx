import { FrontPageHeading } from './FrontPageHeading';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { SearchSection } from './SearchSection';
import { NVADescriptionSection } from './NVADescriptionSection';

const FrontPage = () => (
  <StyledPageContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
    <FrontPageHeading />
    <SearchSection />
    <NVADescriptionSection />
  </StyledPageContent>
);

export default FrontPage;

import { FrontPageHeading } from './FrontPageHeading';
import { StyledPageContent } from '../../components/styled/Wrappers';

const FrontPage = () => (
  <StyledPageContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <FrontPageHeading />
  </StyledPageContent>
);

export default FrontPage;

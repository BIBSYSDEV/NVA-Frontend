import { FrontPageHeading } from './FrontPageHeading';
import { StyledPageContent } from '../../components/styled/Wrappers';
import { SearchSection } from './SearchSection';
import { NvaDescriptionSection } from './NvaDescriptionSection';
import { Box } from '@mui/material';
import { CategorySection } from './CategorySection';

const FrontPage = () => (
  <Box
    sx={{
      bgcolor: '#EFEFEF',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}>
    <StyledPageContent
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: '0.75rem', sm: '2rem' } }}>
      <FrontPageHeading />
      <SearchSection />
      <NvaDescriptionSection />
      <CategorySection />
    </StyledPageContent>
  </Box>
);

export default FrontPage;

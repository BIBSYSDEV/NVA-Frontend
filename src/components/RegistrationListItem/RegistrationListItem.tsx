import { dataTestId } from '../../utils/dataTestIds';
import { Box, ListItemText } from '@mui/material';
import { Title } from './components/Title';
import { TextPreview } from './components/TextPreview';
import { Contributors } from './components/Contributors';
import { TicketTopLine } from './components/TicketTopLine';
import { RegistrationSearchItem } from '../../types/registration.types';
import { RegistrationListItemContext } from './context';

interface RegistrationListItemProps {
  children: React.ReactNode;
  registration: RegistrationSearchItem;
}

const RegistrationListItem = ({ children, registration }: RegistrationListItemProps) => {
  return (
    <RegistrationListItemContext.Provider value={{ registration }}>
      <Box sx={{ display: 'flex', width: '100%', gap: '1rem' }}>
        <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
          {children}
        </ListItemText>
      </Box>
    </RegistrationListItemContext.Provider>
  );
};

RegistrationListItem.Contributors = Contributors;
RegistrationListItem.TextPreview = TextPreview;
RegistrationListItem.TicketTopLine = TicketTopLine;
RegistrationListItem.Title = Title;

export default RegistrationListItem;

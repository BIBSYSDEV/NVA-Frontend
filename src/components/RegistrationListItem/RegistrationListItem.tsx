import { ReactNode } from 'react';
import { dataTestId } from '../../utils/dataTestIds';
import { Box, ListItemText } from '@mui/material';
import { Title } from './components/Title';
import { TextPreview } from './components/TextPreview';
import { RegistrationContributors } from './components/RegistrationContributors';
import { TicketTopLine } from './components/TicketTopLine';
import { RegistrationSearchItem } from '../../types/registration.types';
import { RegistrationListItemContext } from './context';
import { TicketType } from '../../types/publication_types/ticket.types';

interface RegistrationListItemProps {
  children: ReactNode;
  registration: RegistrationSearchItem;
  ticketType?: TicketType;
}

const RegistrationListItem = ({ children, registration, ticketType }: RegistrationListItemProps) => {
  return (
    <RegistrationListItemContext.Provider value={{ registration, ticketType }}>
      <Box sx={{ display: 'flex', width: '100%', gap: '1rem' }}>
        <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
          {children}
        </ListItemText>
      </Box>
    </RegistrationListItemContext.Provider>
  );
};

RegistrationListItem.Contributors = RegistrationContributors;
RegistrationListItem.TextPreview = TextPreview;
RegistrationListItem.TicketTopLine = TicketTopLine;
RegistrationListItem.Title = Title;

export default RegistrationListItem;

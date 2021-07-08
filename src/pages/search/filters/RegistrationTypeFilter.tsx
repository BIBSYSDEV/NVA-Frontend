import { ListItem, Collapse, List, ListItemText } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import styled from 'styled-components';
import { useIsMobile } from '../../../utils/hooks/useIsMobile';

const StyledIndentedListItem = styled(ListItem)`
  padding-left: 2rem;
`;

export const RegistrationTypeFilter = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <ListItem button onClick={toggleOpen}>
        <ListItemText primary="Registration Type" />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <StyledIndentedListItem button>
            <ListItemText primary="Artikkel i tidsskrift" />
          </StyledIndentedListItem>
        </List>
      </Collapse>
    </>
  );
};

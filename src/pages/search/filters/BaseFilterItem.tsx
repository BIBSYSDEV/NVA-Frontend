import { ListItem, Collapse, List, ListItemText } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { useIsMobile } from '../../../utils/hooks/useIsMobile';

const StyledCollapsableList = styled(List)`
  padding-left: 1rem;

  .MuiListSubheader-root {
    line-height: 1.5rem;
  }
`;

interface BaseFilterItemProps {
  title: string;
  children: ReactNode;
}

export const BaseFilterItem = ({ title, children }: BaseFilterItemProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <ListItem button onClick={toggleOpen}>
        <ListItemText primary={title} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <StyledCollapsableList disablePadding>{children}</StyledCollapsableList>
      </Collapse>
    </>
  );
};

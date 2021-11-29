import { ListItem, Collapse, List, ListItemText, Typography, Theme, useMediaQuery } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

const StyledCollapsableList = styled(List)`
  padding-left: 1rem;

  .MuiListSubheader-root {
    line-height: 1.5rem;
  }
`;

const StyledTitle = styled(Typography)`
  font-weight: 600;
`;

interface BaseFilterItemProps {
  title: string;
  children: ReactNode;
}

export const BaseFilterItem = ({ title, children }: BaseFilterItemProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <ListItem button onClick={toggleOpen}>
        <ListItemText disableTypography>
          <StyledTitle>{title}</StyledTitle>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <StyledCollapsableList disablePadding>{children}</StyledCollapsableList>
      </Collapse>
    </>
  );
};

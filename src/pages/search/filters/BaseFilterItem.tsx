import { ListItem, Collapse, List, ListItemText, Typography, Theme, useMediaQuery } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';

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
          <Typography fontWeight={600}>{title}</Typography>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          disablePadding
          sx={{
            pl: '1rem',
            '.MuiListSubheader-root': {
              lineHeight: '1.5rem',
            },
          }}>
          {children}
        </List>
      </Collapse>
    </>
  );
};

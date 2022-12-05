import { Collapse, List, ListItemText, Typography, Theme, useMediaQuery, ListItemButton, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';

interface BaseFilterItemProps {
  title: string;
  fontWeight?: number;
  children: ReactNode;
}

export const BaseFilterItem = ({ title, fontWeight = 600, children }: BaseFilterItemProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Box
      sx={{
        m: '1rem 1.5rem',
        bgcolor: 'background.default',
        borderRadius: '10px',
        border: '2px solid',
        borderColor: 'primary.main',
      }}>
      <ListItemButton onClick={toggleOpen}>
        <ListItemText disableTypography>
          <Typography fontWeight={fontWeight}>{title}</Typography>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>{children}</List>
      </Collapse>
    </Box>
  );
};

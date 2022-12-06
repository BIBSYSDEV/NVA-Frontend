import { Collapse, List, ListItemText, Typography, Theme, useMediaQuery, ListItemButton, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';

interface FacetItemProps {
  title: string;
  children: ReactNode;
}

export const FacetItem = ({ title, children }: FacetItemProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Box
      sx={{
        m: '1rem',
        bgcolor: 'background.default',
        borderRadius: '10px',
        border: '2px solid',
        borderColor: 'primary.main',
      }}>
      <ListItemButton onClick={toggleOpen}>
        <ListItemText>
          <Typography fontWeight={600}>{title}</Typography>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>{children}</List>
      </Collapse>
    </Box>
  );
};

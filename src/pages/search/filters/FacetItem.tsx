import { Collapse, List, ListItemText, Typography, Theme, useMediaQuery, ListItemButton, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FacetItemProps {
  title: string;
  fontWeight?: number;
  children: ReactNode;
}

const itemsToShowByDefault = 5;

export const FacetItem = ({ title, fontWeight = 600, children }: FacetItemProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  const childrenIsArray = Array.isArray(children);
  const [showAll, setShowAll] = useState(childrenIsArray && children.length <= itemsToShowByDefault);

  const itemsToShow = !showAll && childrenIsArray ? children.slice(0, itemsToShowByDefault) : children;

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
        <ListItemText disableTypography>
          <Typography fontWeight={fontWeight}>{title}</Typography>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {itemsToShow}
          {!showAll && (
            <ListItemButton
              title={t('common.show_more')}
              dense
              sx={{ justifyContent: 'space-around' }}
              onClick={() => setShowAll(true)}>
              <ExpandMore />
            </ListItemButton>
          )}
        </List>
      </Collapse>
    </Box>
  );
};

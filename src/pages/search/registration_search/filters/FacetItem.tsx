import { Collapse, List, ListItemText, Typography, Theme, useMediaQuery, ListItemButton, Box } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FacetItemProps {
  title: string;
  children: ReactNode[];
}

const itemsToShowByDefault = 3;

export const FacetItem = ({ title, children }: FacetItemProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  const [showAll, setShowAll] = useState(children.length <= itemsToShowByDefault);
  const itemsToShow = !showAll ? children.slice(0, itemsToShowByDefault) : children;

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: '10px',
        'li:last-of-type': {
          div: {
            borderRadius: '0 0 10px 10px', // Ensure last item does not exeed rounded corner
          },
        },
      }}>
      <ListItemButton onClick={toggleOpen}>
        <ListItemText>
          <Typography fontWeight={600}>{title}</Typography>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          {itemsToShow}
          {!showAll && children.length > itemsToShowByDefault && (
            <li>
              <ListItemButton
                title={t('common.show_more')}
                dense
                sx={{ justifyContent: 'space-around' }}
                onClick={() => setShowAll(!showAll)}>
                <ExpandMore />
              </ListItemButton>
            </li>
          )}
          {showAll && children.length > itemsToShowByDefault && (
            <li>
              <ListItemButton
                title={t('common.show_fewer')}
                dense
                sx={{ justifyContent: 'space-around' }}
                onClick={() => setShowAll(!showAll)}>
                <ExpandLess />
              </ListItemButton>
            </li>
          )}
        </List>
      </Collapse>
    </Box>
  );
};

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Collapse, List, ListItemButton, ListItemText, Theme, Typography, useMediaQuery } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FacetItemContentSkeleton } from './FacetItemContentSkeleton';

interface FacetItemProps {
  dataTestId: string;
  title: string;
  renderCustomSelect?: ReactNode;
  children: ReactNode | ReactNode[];
  isPending?: boolean;
}

const itemsToShowByDefault = 3;

export const FacetItem = ({ title, children, dataTestId, renderCustomSelect, isPending }: FacetItemProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleOpen = () => setIsOpen(!isOpen);

  const [showAll, setShowAll] = useState(false);

  const childrenIsList = Array.isArray(children);

  return (
    <Box
      aria-busy={isPending}
      data-testid={dataTestId}
      sx={{
        bgcolor: 'white',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: '10px',
        'li:last-of-type': {
          div: {
            borderRadius: '0 0 10px 10px', // Ensure last item does not exeed rounded corner
          },
        },
      }}>
      <ListItemButton onClick={toggleOpen} dense>
        <ListItemText>
          <Typography fontWeight={600}>{title}</Typography>
        </ListItemText>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {renderCustomSelect}
        {childrenIsList ? (
          isPending ? (
            <FacetItemContentSkeleton />
          ) : (
            <List disablePadding>
              {showAll ? children : children.slice(0, itemsToShowByDefault)}
              {children.length > itemsToShowByDefault && (
                <li>
                  <ListItemButton
                    title={showAll ? t('common.show_fewer') : t('common.show_more')}
                    dense
                    sx={{ justifyContent: 'space-around' }}
                    onClick={() => setShowAll(!showAll)}>
                    {showAll ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </li>
              )}
            </List>
          )
        ) : (
          children
        )}
      </Collapse>
    </Box>
  );
};

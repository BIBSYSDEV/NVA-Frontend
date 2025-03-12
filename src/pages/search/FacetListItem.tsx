import { ListItem, ListItemButton, Typography, styled } from '@mui/material';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  justifyContent: 'space-between',
  '&.Mui-selected': {
    background: theme.palette.info.light,
  },
}));

interface FacetListItemProps {
  dataTestId: string;
  isSelected: boolean;
  onClickFacet: () => void;
  label: string;
  count: number;
}

export const FacetListItem = ({ dataTestId, isSelected, label, count, onClickFacet }: FacetListItemProps) => (
  <ListItem disablePadding data-testid={dataTestId}>
    <StyledListItemButton dense selected={isSelected} onClick={onClickFacet}>
      <Typography component="span" sx={{ wordBreak: 'break-word' }}>
        {label}
      </Typography>
      {count && <Typography component="span">({count.toLocaleString()})</Typography>}
    </StyledListItemButton>
  </ListItem>
);

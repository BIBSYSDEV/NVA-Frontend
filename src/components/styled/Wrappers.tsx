import { Box, Checkbox, FormGroup, ListItem } from '@mui/material';
import { styled } from '@mui/system';

export const StyledRightAlignedWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const StyledSelectWrapper = styled(Box)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
}));

export const StyledPageContent = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  [theme.breakpoints.up('sm')]: {
    padding: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
}));

export const InputContainerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const BackgroundDiv = styled(Box)(({ theme }) => ({
  background: theme.palette.secondary.light,
  [theme.breakpoints.up('md')]: {
    padding: '1rem 2rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
}));

export const StyledGeneralInfo = styled('div')(({ theme }) => ({
  marginBottom: '1rem',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '1rem',

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const SearchListItem = styled(ListItem)(({ theme }) => ({
  border: '2px solid',
  borderColor: theme.palette.secondary.dark,
  borderLeft: '1.25rem solid',
  flexDirection: 'column',
  alignItems: 'start',
}));

export const ColorizedListItem = styled(ListItem)(({ theme }) => ({
  border: '2px solid',
  borderColor: theme.palette.secondary.dark,
  borderLeft: '1.25rem solid',
}));

export const StyledStatusCheckbox = styled(Checkbox)({
  paddingTop: '0.2rem',
  paddingBottom: '0.2rem',
});

export const StyledTicketSearchFormGroup = styled(FormGroup)({
  margin: '1rem',
});

import { Box, FormGroup, ListItem, ListItemProps, styled, Typography, TypographyProps } from '@mui/material';

export const StyledRightAlignedFooter = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'end',
  gap: '0.5rem',
  mt: '1rem',
});

export const StyledFormFooter = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0.25rem',
});

export const HorizontalBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const StyledRightAlignedWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const WizardStartPageWrapper = styled(Box)({
  maxWidth: '55rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
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
  overflowX: 'auto',
  background: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    padding: '1rem 2rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
  maxWidth: '100vw',
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

export const SearchListItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  borderLeft: `0.75rem solid ${theme.palette.registration.main}`,
  flexDirection: 'column',
  alignItems: 'start',
  background: 'white',
  marginBottom: '0.2rem',
}));

export const SearchListItemDiv = styled('div')(({ theme }) => ({
  borderLeft: `0.75rem solid ${theme.palette.registration.main}`,
  flexDirection: 'column',
  alignItems: 'start',
  background: 'white',
  padding: '0.5rem 1rem',
  marginBottom: '0.2rem',
}));

export const StyledTicketSearchFormGroup = styled(FormGroup)({
  margin: '1rem',
});

export const StyledTruncatableTypography = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const StyledInfoBanner = styled(Box)(({ theme }) => ({
  color: 'white',
  backgroundColor: theme.palette.info.main,
  padding: '0.75rem',
  borderRadius: '0.25rem',
}));

export const StyledFilterHeading = styled(Typography)<TypographyProps>({
  marginBottom: '0.2rem',
  fontWeight: 'bold',
});

export const StyledContributorModalActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  justifyContent: 'space-between',
  marginTop: '2rem',
  gap: '1rem',
}));

import ErrorIcon from '@mui/icons-material/Error';
import SearchIcon from '@mui/icons-material/Search';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DeleteIconButton } from '../../pages/messages/components/DeleteIconButton';
import { dataTestId } from '../../utils/dataTestIds';
import { StyledOrganizationBox } from './OrganizationBox';

interface UnconfirmedOrganizationBoxProps extends Pick<BoxProps, 'sx'> {
  name: string;
  onIdentifyAffiliationClick: (name: string) => void;
  removeAffiliation?: () => void;
}

export const UnconfirmedOrganizationBox = ({
  name,
  sx,
  onIdentifyAffiliationClick,
  removeAffiliation,
}: UnconfirmedOrganizationBoxProps) => {
  const { t } = useTranslation();

  return (
    <StyledOrganizationBox
      sx={{
        ...sx,
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
          gap: '0.25rem',
        }}>
        <Box sx={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <ErrorIcon color="warning" />
          <Typography fontWeight="bold">{t('registration.contributors.institution_is_unidentified')}</Typography>
        </Box>
        <Typography>"{name}"</Typography>
        <Button
          variant="outlined"
          sx={{ padding: '0.1rem 0.5rem', maxWidth: '14rem', bgcolor: 'secondary.light' }}
          data-testid={dataTestId.registrationWizard.contributors.verifyAffiliationButton}
          startIcon={<SearchIcon />}
          onClick={() => name && onIdentifyAffiliationClick(name)}>
          {t('registration.contributors.verify_affiliation')}
        </Button>
      </Box>
      {removeAffiliation && (
        <DeleteIconButton
          data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
          onClick={removeAffiliation}
          tooltip={t('registration.contributors.remove_affiliation')}
        />
      )}
    </StyledOrganizationBox>
  );
};

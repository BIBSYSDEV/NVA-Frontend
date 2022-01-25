import { useTranslation } from 'react-i18next';
import { Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { StyledRightAlignedWrapper } from '../../components/styled/Wrappers';

interface InstitutionCardProps {
  orgunitId: string;
  setInstitutionIdToRemove: (orgunitId: string) => void;
}

export const InstitutionCard = ({ orgunitId, setInstitutionIdToRemove }: InstitutionCardProps) => {
  const { t } = useTranslation('common');

  return (
    <Paper elevation={3} data-testid="institution-presentation" sx={{ p: '1rem' }}>
      <AffiliationHierarchy unitUri={orgunitId} />
      <StyledRightAlignedWrapper sx={{ mt: '0.5rem' }}>
        <Button
          color="error"
          variant="outlined"
          data-testid={`button-delete-institution-${orgunitId}`}
          startIcon={<DeleteIcon />}
          onClick={() => setInstitutionIdToRemove(orgunitId)}>
          {t('remove')}
        </Button>
      </StyledRightAlignedWrapper>
    </Paper>
  );
};

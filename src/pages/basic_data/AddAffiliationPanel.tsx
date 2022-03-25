import { Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import { SelectInstitutionForm } from '../../components/institution/SelectInstitutionForm';
import { StyledCenterContainer } from '../../components/styled/Wrappers';

export const AddAffiliationPanel = () => {
  const { t } = useTranslation('basicData');
  return (
    <>
      <StyledCenterContainer>
        <LooksTwoIcon color="primary" fontSize="large" />
      </StyledCenterContainer>
      <SelectInstitutionForm onSubmit={(id) => console.log(id)} />

      <Box display={{ display: 'flex', gap: '1rem' }}>
        <TextField fullWidth variant="filled" label={t('position')} />
        <TextField fullWidth variant="filled" label={t('position_percent')} />
      </Box>
      <Box display={{ display: 'flex', gap: '1rem' }}>
        <TextField fullWidth variant="filled" label={t('common:start_date')} />
        <TextField fullWidth variant="filled" label={t('common:end_date')} />
      </Box>
    </>
  );
};

import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ScientificValueFilter = () => {
  const [t] = useTranslation();

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControlLabel control={<Checkbox />} label={t('search.advanced_search.scientific_value.level_zero')} />
      <FormControlLabel control={<Checkbox />} label={t('search.advanced_search.scientific_value.level_one')} />
      <FormControlLabel control={<Checkbox />} label={t('search.advanced_search.scientific_value.level_two')} />
    </Box>
  );
};

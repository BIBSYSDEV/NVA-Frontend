import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { dataTestId } from '../../utils/dataTestIds';

export const ChannelClaimFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectLabelId = 'select-label-id';

  return (
    <Box sx={{ display: 'flex', gap: '1rem', my: '1rem', justifyContent: 'end' }}>
      <FormControl size="small">
        <InputLabel id={selectLabelId}>{t('tasks.display_options')}</InputLabel>
        <Select
          data-testid={dataTestId.editor.channelClaimFilterSelect}
          sx={{ bgcolor: 'white', minWidth: '12rem' }}
          labelId={selectLabelId}
          label={t('tasks.display_options')}
          size="small"
          variant="outlined"
          value={searchParams.get('viewingOptions') || 'showAll'}
          onChange={(event) => {
            const selectedOption = event.target.value;
            setSearchParams((params) => {
              if (selectedOption === 'showOwn') {
                params.set('viewingOptions', selectedOption);
              } else {
                params.delete('viewingOptions');
              }
              return params;
            });
          }}>
          <MenuItem value="showAll">{t('common.show_all')}</MenuItem>
          <MenuItem value="showOwn">{t('editor.institution.channel_claims.show_only_my_institution')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ChannelClaimParams } from '../../api/searchApi';
import { dataTestId } from '../../utils/dataTestIds';

const selectLabelId = 'select-label-id';

export const ChannelClaimFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Box sx={{ display: 'flex', gap: '1rem', my: '1rem', justifyContent: 'end' }}>
      <FormControl>
        <InputLabel id={selectLabelId}>{t('tasks.display_options')}</InputLabel>
        <Select
          data-testid={dataTestId.editor.channelClaimFilterSelect}
          sx={{ bgcolor: 'white', minWidth: '12rem' }}
          labelId={selectLabelId}
          label={t('tasks.display_options')}
          size="small"
          variant="outlined"
          value={searchParams.get(ChannelClaimParams.ViewingOptions) || 'showAll'}
          onChange={(event) => {
            const selectedOption = event.target.value;
            setSearchParams((params) => {
              if (selectedOption === 'showOwn') {
                params.set(ChannelClaimParams.ViewingOptions, selectedOption);
              } else {
                params.delete(ChannelClaimParams.ViewingOptions);
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

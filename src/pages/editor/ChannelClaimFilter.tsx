import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ChannelClaimParams } from '../../api/searchApi';
import { dataTestId } from '../../utils/dataTestIds';

enum ChannelClaimsViewingOptions {
  ShowAll = 'showAll',
  ShowOwn = 'showOwn',
}

export const ChannelClaimFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Box sx={{ display: 'flex', my: '1rem', justifyContent: 'end' }}>
      <TextField
        select
        data-testid={dataTestId.editor.channelClaimFilterSelect}
        sx={{ bgcolor: 'white', minWidth: '12rem' }}
        label={t('tasks.display_options')}
        size="small"
        variant="outlined"
        value={searchParams.get(ChannelClaimParams.ViewingOptions) || ChannelClaimsViewingOptions.ShowAll}
        onChange={(event) => {
          const selectedOption = event.target.value;
          setSearchParams((params) => {
            if (selectedOption === ChannelClaimsViewingOptions.ShowAll) {
              params.set(ChannelClaimParams.ViewingOptions, selectedOption);
            } else {
              params.delete(ChannelClaimParams.ViewingOptions);
            }
            return params;
          });
        }}>
        <MenuItem value="showAll">{t('common.show_all')}</MenuItem>
        <MenuItem value="showOwn">{t('editor.institution.channel_claims.show_only_my_institution')}</MenuItem>
      </TextField>
    </Box>
  );
};

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const CompareDoiField = ({ doi }: { doi: string }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        variant="standard"
        label={t('common.doi')}
        size="small"
        sx={{ flex: '1 10rem' }}
        disabled
        multiline
        value={doi}
      />
      {doi && (
        <Button
          href={doi}
          endIcon={<OpenInNewIcon />}
          size="small"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined">
          {t('common.open')}
        </Button>
      )}
    </Box>
  );
};

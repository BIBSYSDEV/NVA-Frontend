import LabelIcon from '@mui/icons-material/Label';
import LinkIcon from '@mui/icons-material/Link';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const InstitutionSupport = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h2">{t('editor.institution.institution_support')}</Typography>
      <Typography sx={{ fontStyle: 'italic', marginTop: '0.5rem', marginBottom: '1rem' }}>
        {t('editor.retention_strategy.rrs_required_link')}
      </Typography>

      <Typography>{t('editor.institution.institution_support_description')}</Typography>

      <Box sx={{ display: 'flex', gap: '1rem', maxWidth: '70%' }}>
        <TextField
          type="url"
          label={t('common.url')}
          placeholder={t('editor.retention_strategy.rrs_link')}
          variant="filled"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="text"
          label={t('common.url_name')}
          placeholder={t('editor.retention_strategy.rrs_link')}
          variant="filled"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LabelIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
};

import { Box, TextField, CircularProgress, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { isValidUrl } from '../../../../../utils/hooks/useFetchResource';

interface ExternalLinkFieldProps {
  onAddClick: (url: string) => void;
}

export const ExternalLinkField = ({ onAddClick }: ExternalLinkFieldProps) => {
  const { t } = useTranslation();
  const [inputUrl, setInputUrl] = useState('');
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);

  useEffect(() => {
    const validateUrlHeadResponse = async () => {
      setIsVerifyingLink(true);
      try {
        const linkResponse = await fetch(inputUrl, { method: 'HEAD', mode: 'no-cors' });
        if (linkResponse) {
          setIsValidLink(true);
        }
      } catch {
        setIsValidLink(false);
      }
      setIsVerifyingLink(false);
    };

    if (isValidUrl(inputUrl)) {
      validateUrlHeadResponse();
    } else {
      setIsValidLink(false);
    }
  }, [inputUrl]);

  const canShowErrorState = !!inputUrl && !isVerifyingLink && !isValidLink;

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <TextField
        variant="filled"
        fullWidth
        sx={{ maxWidth: '40rem' }}
        label={t('registration.resource_type.research_data.external_link')}
        value={inputUrl}
        onChange={(event) => setInputUrl(event.target.value)}
        helperText={
          canShowErrorState
            ? t('registration.resource_type.research_data.external_link_helper_text_error')
            : t('registration.resource_type.research_data.external_link_helper_text')
        }
        error={canShowErrorState}
      />
      {inputUrl &&
        (isVerifyingLink ? (
          <CircularProgress aria-label={t('registration.resource_type.research_data.validating_link')} />
        ) : isValidLink ? (
          <Button
            variant="outlined"
            sx={{ height: 'fit-content', mt: '0.5rem' }}
            disabled={!inputUrl || !isValidLink || isVerifyingLink}
            onClick={() => {
              onAddClick(inputUrl);
              setInputUrl('');
            }}
            startIcon={<AddIcon />}>
            {t('registration.resource_type.research_data.add_link')}
          </Button>
        ) : null)}
    </Box>
  );
};

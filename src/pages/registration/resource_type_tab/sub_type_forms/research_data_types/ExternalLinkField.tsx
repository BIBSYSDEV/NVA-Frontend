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

      await fetch(inputUrl, { method: 'HEAD', mode: 'no-cors' })
        .then(() => setIsValidLink(true))
        .catch(() => setIsValidLink(false));
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
        label="Eksterne lenker"
        value={inputUrl}
        onChange={(event) => setInputUrl(event.target.value)}
        helperText={
          canShowErrorState
            ? 'Ugyldig URL. Pass på at lenken du oppgir er fullstendig. Eksempel: https://sikt.no'
            : 'Oppgi ekstern URL med relatert innhold.'
        }
        error={canShowErrorState}
      />
      {inputUrl &&
        (isVerifyingLink ? (
          <CircularProgress aria-label="Validerer lenke" />
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
            Legg til lenke
          </Button>
        ) : null)}
    </Box>
  );
};

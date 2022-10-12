import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { isValidUrl } from '../../../../../utils/general-helpers';
import { dataTestId } from '../../../../../utils/dataTestIds';

interface ExternalLinkFieldProps {
  onAddClick: (url: string) => void;
}

export const ExternalLinkField = ({ onAddClick }: ExternalLinkFieldProps) => {
  const { t } = useTranslation();
  const [inputUrl, setInputUrl] = useState('');

  const isValidInput = isValidUrl(inputUrl);
  const showErrorMessage = !!inputUrl && !isValidInput;

  const onClickAdd = () => {
    onAddClick(inputUrl);
    setInputUrl('');
  };

  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <TextField
        data-testid={dataTestId.registrationWizard.resourceType.externalLinkField}
        variant="filled"
        fullWidth
        onKeyPress={({ key }) => {
          if (key === 'Enter' && isValidInput) {
            onClickAdd();
          }
        }}
        sx={{ maxWidth: '40rem' }}
        label={t('registration.resource_type.research_data.external_link')}
        value={inputUrl}
        onChange={(event) => setInputUrl(event.target.value)}
        helperText={
          showErrorMessage
            ? t('registration.resource_type.research_data.external_link_helper_text_error')
            : t('registration.resource_type.research_data.external_link_helper_text')
        }
        error={showErrorMessage}
      />
      <Button
        variant="outlined"
        sx={{ height: 'fit-content', mt: '0.5rem' }}
        disabled={!isValidInput}
        onClick={onClickAdd}
        startIcon={<AddIcon />}>
        {t('registration.resource_type.research_data.add_link')}
      </Button>
    </Box>
  );
};

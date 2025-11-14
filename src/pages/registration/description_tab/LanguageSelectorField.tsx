import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { getLanguageByIso6393Code } from 'nva-language';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { registrationLanguageOptions } from '../../../utils/registration-helpers';
import { useThreeLetterLanguageCode } from '../../../utils/translation-helpers';

interface LanguageSelectorProps extends Omit<TextFieldProps, 'value'> {
  value?: string;
}

export const LanguageSelectorField = (props: LanguageSelectorProps) => {
  const { t } = useTranslation();
  const languageCode = useThreeLetterLanguageCode();

  return (
    <TextField
      {...props}
      value={props.value ?? ''}
      data-testid={dataTestId.registrationWizard.description.languageField}
      fullWidth
      label={t('registration.description.primary_language')}
      placeholder={t('registration.description.primary_language')}
      select
      variant="filled">
      {!registrationLanguageOptions.some((language) => language.uri === props.value) && (
        // Show if Registration has a language that's currently not supported
        <MenuItem value={props.value} disabled>
          {getLanguageByIso6393Code('und')[languageCode]}
        </MenuItem>
      )}
      {registrationLanguageOptions.map((language) => (
        <MenuItem
          value={language.uri}
          key={language.uri}
          data-testid={dataTestId.registrationWizard.description.languageItem(language.uri)}>
          {language[languageCode]}
        </MenuItem>
      ))}
    </TextField>
  );
};

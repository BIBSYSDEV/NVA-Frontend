import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { getLanguageByIso6393Code } from 'nva-language';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { ShowMoreDropdownItemsButton } from '../../../components/buttons/ShowMoreDropdownItemsButton';
import { useLanguageOptions } from '../../../utils/language-helpers/useLanguageOptions';
import { useShowAll } from '../../../utils/hooks/useShowAll';

interface LanguageSelectorFieldProps extends Omit<TextFieldProps, 'value'> {
  value?: string;
}

export const LanguageSelectorField = (props: LanguageSelectorFieldProps) => {
  const { t } = useTranslation();
  const { primaryLanguages, restOfLanguages, allLanguages, appLanguage } = useLanguageOptions();
  const { showAll, setShowAll, firstRestItemRef } = useShowAll();

  return (
    <TextField
      {...props}
      value={props.value ?? ''}
      data-testid={dataTestId.registrationWizard.description.languageField}
      fullWidth
      label={t('registration.description.primary_language')}
      placeholder={t('registration.description.primary_language')}
      select
      slotProps={{
        select: {
          MenuProps: {
            PaperProps: { sx: { maxHeight: '20rem' } },
          },
          onClose: () => setShowAll(false),
          renderValue: (value) => {
            const selected = allLanguages.find((lang) => lang.uri === value);
            return selected ? selected[appLanguage] : getLanguageByIso6393Code('und')[appLanguage];
          },
        },
      }}
      variant="filled">
      {props.value && !allLanguages.some((language) => language.uri === props.value) && (
        // Show if Registration has a language that's currently not supported
        <MenuItem value={props.value} disabled>
          {getLanguageByIso6393Code('und')[appLanguage]}
        </MenuItem>
      )}
      {primaryLanguages.map((language) => (
        <MenuItem
          value={language.uri}
          key={language.uri}
          data-testid={dataTestId.registrationWizard.description.languageItem(language.uri)}>
          {language[appLanguage]}
        </MenuItem>
      ))}
      <ShowMoreDropdownItemsButton
        showAll={showAll}
        onExpand={() => setShowAll(true)}
        dataTestId={dataTestId.registrationWizard.description.showMoreLanguagesButton}
      />
      {showAll &&
        restOfLanguages.map((language, index) => (
          <MenuItem
            ref={index === 0 ? firstRestItemRef : undefined}
            value={language.uri}
            key={language.uri}
            data-testid={dataTestId.registrationWizard.description.languageItem(language.uri)}>
            {language[appLanguage]}
          </MenuItem>
        ))}
    </TextField>
  );
};

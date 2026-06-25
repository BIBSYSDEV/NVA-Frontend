import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListSubheader, MenuItem, TextField, TextFieldProps } from '@mui/material';
import { getLanguageByIso6393Code } from 'nva-language';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageOptions } from '../../../utils/language-helpers/language-helpers';
import { useThreeLetterLanguageCode } from '../../../utils/translation-helpers';

interface LanguageSelectorFieldProps extends Omit<TextFieldProps, 'value'> {
  value?: string;
}

export const LanguageSelectorField = (props: LanguageSelectorFieldProps) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const firstRestItemRef = useRef<HTMLLIElement>(null);
  const appLanguage = useThreeLetterLanguageCode();

  useLayoutEffect(() => {
    if (showAll) {
      firstRestItemRef.current?.focus();
    }
  }, [showAll]);
  const { primaryLanguages, restOfLanguages } = getLanguageOptions(appLanguage);
  const allLanguages = [...primaryLanguages, ...restOfLanguages];

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
      <ListSubheader
        disableSticky
        role="button"
        tabIndex={0}
        data-testid={dataTestId.registrationWizard.description.showMoreLanguagesButton}
        onMouseDown={(e) => {
          e.preventDefault();
          setShowAll(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setShowAll(true);
          }
        }}
        sx={{
          cursor: 'pointer',
          color: 'primary.main',
          display: showAll ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {t('common.show_more')}
        <ExpandMoreIcon aria-hidden="true" />
      </ListSubheader>
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

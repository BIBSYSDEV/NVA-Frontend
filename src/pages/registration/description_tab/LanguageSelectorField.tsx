import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListSubheader, MenuItem, TextField, TextFieldProps } from '@mui/material';
import { getLanguageByIso6393Code } from 'nva-language';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageOptions } from '../../../utils/language-helpers/language-helpers';
import { useIso6393LanguageCode } from '../../../utils/translation-helpers';

interface LanguageSelectorProps extends Omit<TextFieldProps, 'value'> {
  value?: string;
}

export const LanguageSelectorField = (props: LanguageSelectorProps) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const firstRestItemRef = useRef<HTMLLIElement>(null);
  const languageCode = useIso6393LanguageCode();

  useLayoutEffect(() => {
    if (showAll) {
      firstRestItemRef.current?.focus();
    }
  }, [showAll]);
  const { primaryLanguages, restOfLanguages } = getLanguageOptions(languageCode);

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
        },
      }}
      variant="filled">
      {props.value && ![...primaryLanguages, ...restOfLanguages].some((language) => language.uri === props.value) && (
        // Show if Registration has a language that's currently not supported
        <MenuItem value={props.value} disabled>
          {getLanguageByIso6393Code('und')[languageCode]}
        </MenuItem>
      )}
      {primaryLanguages.map((language) => (
        <MenuItem
          value={language.uri}
          key={language.uri}
          data-testid={dataTestId.registrationWizard.description.languageItem(language.uri)}>
          {language[languageCode]}
        </MenuItem>
      ))}
      <ListSubheader
        disableSticky
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
            {language[languageCode]}
          </MenuItem>
        ))}
    </TextField>
  );
};

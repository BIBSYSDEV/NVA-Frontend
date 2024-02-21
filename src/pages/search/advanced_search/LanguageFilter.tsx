import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { getLanguageByIso6393Code } from 'nva-language';
import { useHistory } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import i18n from '../../../translations/i18n';
import { dataTestId } from '../../../utils/dataTestIds';

const languageOptions = [
  getLanguageByIso6393Code('eng'),
  getLanguageByIso6393Code('nob'),
  getLanguageByIso6393Code('nno'),
  getLanguageByIso6393Code('dan'),
  getLanguageByIso6393Code('fin'),
  getLanguageByIso6393Code('fra'),
  getLanguageByIso6393Code('isl'),
  getLanguageByIso6393Code('ita'),
  getLanguageByIso6393Code('nld'),
  getLanguageByIso6393Code('por'),
  getLanguageByIso6393Code('rus'),
  getLanguageByIso6393Code('sme'),
  getLanguageByIso6393Code('spa'),
  getLanguageByIso6393Code('swe'),
  getLanguageByIso6393Code('deu'),
  getLanguageByIso6393Code('mis'),
];

const getLanguageCodeFromUri = (uri: string) => {
  return uri.split('/').pop();
};

export const LanguageFilter = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const languageParam = searchParams.get(ResultParam.PublicationLanguageShould)?.split(',') || [];

  const handleChange = (selectedUris: string[] | null) => {
    if (selectedUris) {
      const selectedLanguages = selectedUris
        .map((uri) => {
          const selectedLanguage = languageOptions.find(
            (language) => getLanguageCodeFromUri(language.uri) === getLanguageCodeFromUri(uri)
          );
          return selectedLanguage ? getLanguageCodeFromUri(selectedLanguage.uri) : null;
        })
        .filter(Boolean);

      if (selectedLanguages.length > 0) {
        searchParams.set(ResultParam.PublicationLanguageShould, selectedLanguages.join(','));
      } else {
        searchParams.delete(ResultParam.PublicationLanguageShould);
      }
    } else {
      searchParams.delete(ResultParam.PublicationLanguageShould);
    }

    history.push({ search: searchParams.toString() });
  };

  return (
    <FormControl fullWidth sx={{ maxWidth: '15rem' }}>
      <InputLabel>{t('registration.description.primary_language')}</InputLabel>
      <Select
        multiple
        value={languageParam}
        data-testid={dataTestId.registrationWizard.description.languageField}
        label={t('registration.description.primary_language')}
        onChange={(event) => {
          handleChange(event.target.value as string[]);
        }}
        variant="outlined">
        {languageOptions.map(({ uri, nob, eng }) => (
          <MenuItem value={uri} key={uri} data-testid={`registration-language-${uri}`}>
            {i18n.language === 'nob' ? nob : eng}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

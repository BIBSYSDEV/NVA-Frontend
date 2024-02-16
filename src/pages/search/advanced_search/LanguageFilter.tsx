import { MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { Language, getLanguageByIso6393Code } from 'nva-language';
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

export const LanguageFilter = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const languageParam = searchParams.get(ResultParam.Query);

  const handleChange = (selectedUri: string | Language | null) => {
    const selectedValue = languageOptions.find((value) => value.uri === selectedUri);
    if (selectedValue) {
      searchParams.set(ResultParam.Query, selectedValue.uri);
    } else {
      searchParams.delete(ResultParam.Query);
    }

    history.push({ search: searchParams.toString() });
  };

  return (
    <Select
      sx={{ maxWidth: '15rem' }}
      value={languageParam ?? ''}
      data-testid={dataTestId.registrationWizard.description.languageField}
      fullWidth
      size="small"
      label={t('registration.description.primary_language')}
      placeholder={t('registration.description.primary_language')}
      onChange={(event) => {
        handleChange(event.target.value);
      }}
      variant="filled">
      <MenuItem value={''}>{t('registration.description.primary_language')}</MenuItem>
      {languageOptions.map(({ uri, nob, eng }) => (
        <MenuItem value={uri} key={uri} data-testid={`registration-language-${uri}`}>
          {i18n.language === 'nob' ? nob : eng}
        </MenuItem>
      ))}
    </Select>
  );
};

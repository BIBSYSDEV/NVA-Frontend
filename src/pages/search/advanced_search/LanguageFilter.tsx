import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import i18n from '../../../translations/i18n';
import { dataTestId } from '../../../utils/dataTestIds';
import { languageOptions } from '../../registration/DescriptionPanel';

export const LanguageFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const languageParam = searchParams.get(ResultParam.PublicationLanguageShould)?.split(',') || [];

  const handleChange = (selectedUris: string[] | null) => {
    if (selectedUris) {
      const selectedLanguages = selectedUris
        .map((iso6393Code) => {
          const selectedLanguage = languageOptions.find((language) => language.iso6393Code === iso6393Code);
          return selectedLanguage ? selectedLanguage.iso6393Code : null;
        })
        .filter(Boolean);

      if (selectedLanguages.length > 0) {
        searchParams.set(ResultParam.PublicationLanguageShould, selectedLanguages.join(','));
      }
    } else {
      searchParams.delete(ResultParam.PublicationLanguageShould);
    }

    history.push({ search: searchParams.toString() });
  };

  const clearValues = () => {
    searchParams.delete(ResultParam.PublicationLanguageShould);
    history.push({ search: searchParams.toString() });
  };

  return (
    <>
      <FormControl fullWidth sx={{ maxWidth: '15rem' }}>
        <InputLabel>{t('registration.description.primary_language')}</InputLabel>
        <Select
          multiple
          value={languageParam}
          data-testid={dataTestId.startPage.advancedSearch.publicationLanguageField}
          label={t('registration.description.primary_language')}
          onChange={(event) => {
            handleChange(event.target.value as string[]);
          }}
          variant="outlined">
          {languageOptions.map(({ uri, iso6393Code, nob, eng }) => (
            <MenuItem value={iso6393Code} key={uri} data-testid={`publication-language-${uri}`}>
              {i18n.language === 'nob' || i18n.language === 'nno' ? nob : eng}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton onClick={clearValues}>
        <ClearIcon fontSize="small" />
      </IconButton>
    </>
  );
};

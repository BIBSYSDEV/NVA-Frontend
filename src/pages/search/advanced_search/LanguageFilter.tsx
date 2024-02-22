import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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
    if (selectedUris && selectedUris.length > 0) {
      const languages = selectedUris
        .map((iso6393Code) => {
          const selectedLanguage = languageOptions.find((language) => language.iso6393Code === iso6393Code);
          return selectedLanguage ? selectedLanguage.iso6393Code : null;
        })
        .filter(Boolean);

      if (languages.length > 0) {
        searchParams.set(ResultParam.PublicationLanguageShould, languages.join(','));
      } else {
        searchParams.delete(ResultParam.PublicationLanguageShould);
      }
    } else {
      searchParams.delete(ResultParam.PublicationLanguageShould);
    }

    history.push({ search: searchParams.toString() });
  };

  const handleDelete = (iso6393CodeToDelete?: string) => () => {
    selectedLanguages.length > 1
      ? handleChange(languageParam.filter((iso6393Code) => iso6393Code !== iso6393CodeToDelete))
      : handleChange([]);
  };

  const selectedLanguages = languageParam
    .map((iso6393Code) => languageOptions.find((language) => language.iso6393Code === iso6393Code))
    .filter(Boolean);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '15rem' }}>
      <FormControl fullWidth sx={{ width: '15rem' }}>
        <InputLabel>{t('registration.description.primary_language')}</InputLabel>
        <Select
          multiple
          value={languageParam}
          data-testid={dataTestId.startPage.advancedSearch.publicationLanguageField}
          label={t('registration.description.primary_language')}
          onChange={(event) => {
            handleChange(event.target.value as string[]);
          }}
          renderValue={() => t('search.choose_one_or_more')}
          variant="outlined">
          {languageOptions.map(({ uri, iso6393Code, nob, eng }) => (
            <MenuItem value={iso6393Code} key={uri} data-testid={`publication-language-${uri}`}>
              {i18n.language === 'nob' ? nob : eng}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {selectedLanguages.map((language, index) => (
          <Chip
            sx={{ mb: '0.25rem' }}
            key={index}
            label={i18n.language === 'nob' ? language?.nob : language?.eng}
            onDelete={handleDelete(language?.iso6393Code)}
          />
        ))}
      </Box>
    </Box>
  );
};

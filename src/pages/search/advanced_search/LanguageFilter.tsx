import { Box, Chip, MenuItem, Select } from '@mui/material';
import { Language } from 'nva-language';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { registrationLanguageOptions } from '../../../utils/registration-helpers';
import { useLocation, useNavigate } from 'react-router-dom';

export const LanguageFilter = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const languageParam = searchParams.get(ResultParam.PublicationLanguageShould)?.split(',') || [];
  const [open, setOpen] = useState(false);

  const toggleOpenOptions = () => {
    setOpen(!open);
  };

  const updateSelectedLanguages = (selectedUris: string[]) => {
    if (selectedUris && selectedUris.length > 0) {
      const languages = selectedUris
        .map(
          (iso6393Code) =>
            registrationLanguageOptions.find((language) => language.iso6393Code === iso6393Code)?.iso6393Code
        )
        .filter(Boolean);

      if (languages.length > 0) {
        searchParams.set(ResultParam.PublicationLanguageShould, languages.join(','));
      } else {
        searchParams.delete(ResultParam.PublicationLanguageShould);
      }
    } else {
      searchParams.delete(ResultParam.PublicationLanguageShould);
    }

    navigate({ search: searchParams.toString() });
  };

  const selectedLanguages = languageParam
    .map((iso6393Code) => registrationLanguageOptions.find((language) => language.iso6393Code === iso6393Code))
    .filter(Boolean) as Language[];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '15rem' }}>
      <Select
        labelId="language-select-label"
        multiple
        size="small"
        open={open}
        onOpen={toggleOpenOptions}
        onClose={toggleOpenOptions}
        value={languageParam}
        data-testid={dataTestId.startPage.advancedSearch.publicationLanguageField}
        onChange={(event) => {
          updateSelectedLanguages(event.target.value as string[]);
          toggleOpenOptions();
        }}
        displayEmpty
        renderValue={() => t('search.advanced_search.choose_one_or_more')}
        variant="outlined">
        {registrationLanguageOptions.map(({ uri, iso6393Code, nob, eng }) => (
          <MenuItem value={iso6393Code} key={uri} data-testid={`publication-language-${uri}`}>
            {i18n.language === 'nob' ? nob : eng}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: { lg: '25rem' } }}>
        {selectedLanguages.map((language) => (
          <Chip
            color="primary"
            sx={{ mb: '0.25rem' }}
            key={language.uri}
            label={i18n.language === 'nob' ? language?.nob : language?.eng}
            onDelete={() =>
              updateSelectedLanguages(languageParam.filter((iso6393Code) => iso6393Code !== language?.iso6393Code))
            }
          />
        ))}
      </Box>
    </Box>
  );
};

import { Box, Chip, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import { Language } from 'nva-language';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import i18n from '../../../translations/i18n';
import { dataTestId } from '../../../utils/dataTestIds';
import { languageOptions } from '../../registration/DescriptionPanel';

const StyledChip = styled(Chip)(({ theme }) => ({
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.main,
  },
}));

export const LanguageFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const languageParam = searchParams.get(ResultParam.PublicationLanguageShould)?.split(',') || [];
  const [open, setOpen] = useState(false);

  const toggleOpenOptions = () => {
    setOpen(!open);
  };

  const updateSelectedLanguages = (selectedUris: string[]) => {
    if (selectedUris && selectedUris.length > 0) {
      const languages = selectedUris
        .map((iso6393Code) => languageOptions.find((language) => language.iso6393Code === iso6393Code)?.iso6393Code)
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

  const selectedLanguages = languageParam
    .map((iso6393Code) => languageOptions.find((language) => language.iso6393Code === iso6393Code))
    .filter(Boolean) as Language[];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '15rem' }}>
      <FormControl>
        <InputLabel sx={{ lineHeight: '0.75' }}>{t('search.advanced_search.choose_one_or_more')}</InputLabel>
        <Select
          multiple
          size="small"
          open={open}
          onOpen={toggleOpenOptions}
          onClose={toggleOpenOptions}
          value={languageParam}
          data-testid={dataTestId.startPage.advancedSearch.publicationLanguageField}
          label={t('registration.description.primary_language')}
          onChange={(event) => {
            updateSelectedLanguages(event.target.value as string[]);
            toggleOpenOptions();
          }}
          renderValue={() => t('search.advanced_search.choose_one_or_more')}
          variant="outlined">
          {languageOptions.map(({ uri, iso6393Code, nob, eng }) => (
            <MenuItem value={iso6393Code} key={uri} data-testid={`publication-language-${uri}`}>
              {i18n.language === 'nob' ? nob : eng}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {selectedLanguages.map((language) => (
          <StyledChip
            sx={{ mb: '0.25rem', borderColor: 'primary.main' }}
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

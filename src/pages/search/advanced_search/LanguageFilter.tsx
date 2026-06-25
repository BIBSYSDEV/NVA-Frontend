import { Box, Chip, MenuItem, Select } from '@mui/material';
import { Language } from 'nva-language';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { ShowMoreDropdownItemsButton } from '../../../components/buttons/ShowMoreDropdownItemsButton';
import { useLanguageOptions } from '../../../utils/language-helpers/useLanguageOptions';
import { useShowAll } from '../../../utils/hooks/useShowAll';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export const LanguageFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const languageParam = searchParams.get(ResultParam.PublicationLanguageShould)?.split(',') || [];
  const [open, setOpen] = useState(false);
  const { primaryLanguages, restOfLanguages, allLanguages, appLanguage } = useLanguageOptions();
  const { showAll, setShowAll, firstRestItemRef } = useShowAll();

  const handleClose = () => {
    setOpen(false);
    setShowAll(false);
  };

  const updateSelectedLanguages = (selectedCodes: string[]) => {
    const syncedParams = syncParamsWithSearchFields(searchParams);
    if (selectedCodes && selectedCodes.length > 0) {
      const languages = selectedCodes
        .map((iso6393Code) => allLanguages.find((language) => language.iso6393Code === iso6393Code)?.iso6393Code)
        .filter(Boolean);

      if (languages.length > 0) {
        syncedParams.set(ResultParam.PublicationLanguageShould, languages.join(','));
      } else {
        syncedParams.delete(ResultParam.PublicationLanguageShould);
      }
    } else {
      syncedParams.delete(ResultParam.PublicationLanguageShould);
    }
    syncedParams.delete(ResultParam.From);
    navigate({ search: syncedParams.toString() });
  };

  const selectedLanguages = languageParam
    .map((iso6393Code) => allLanguages.find((language) => language.iso6393Code === iso6393Code))
    .filter(Boolean) as Language[];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '15rem' }}>
      <Select
        labelId="language-select-label"
        multiple
        size="small"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleClose}
        value={languageParam}
        data-testid={dataTestId.startPage.advancedSearch.publicationLanguageField}
        onChange={(event) => {
          updateSelectedLanguages(event.target.value as string[]);
          handleClose();
        }}
        displayEmpty
        renderValue={() => t('search.advanced_search.choose_one_or_more')}
        MenuProps={{ PaperProps: { sx: { maxHeight: '20rem' } } }}
        variant="outlined">
        {primaryLanguages.map((language) => (
          <MenuItem
            value={language.iso6393Code}
            key={language.uri}
            data-testid={`publication-language-${language.uri}`}>
            {language[appLanguage]}
          </MenuItem>
        ))}
        <ShowMoreDropdownItemsButton showAll={showAll} onExpand={() => setShowAll(true)} />
        {showAll &&
          restOfLanguages.map((language, index) => (
            <MenuItem
              ref={index === 0 ? firstRestItemRef : undefined}
              value={language.iso6393Code}
              key={language.uri}
              data-testid={`publication-language-${language.uri}`}>
              {language[appLanguage]}
            </MenuItem>
          ))}
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: { lg: '25rem' } }}>
        {selectedLanguages.map((language) => (
          <Chip
            color="secondary"
            variant="filled"
            sx={{ mb: '0.25rem' }}
            key={language.uri}
            label={language[appLanguage]}
            onDelete={() =>
              updateSelectedLanguages(languageParam.filter((iso6393Code) => iso6393Code !== language?.iso6393Code))
            }
          />
        ))}
      </Box>
    </Box>
  );
};

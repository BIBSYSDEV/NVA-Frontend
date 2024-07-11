import { Autocomplete, Box, TextFieldProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerifiedFundingApiPath } from '../api/apiPaths';
import { SearchResponse } from '../types/common.types';
import { NfrProject } from '../types/project.types';
import { dataTestId } from '../utils/dataTestIds';
import { getPeriodString } from '../utils/general-helpers';
import { useDebounce } from '../utils/hooks/useDebounce';
import { useFetch } from '../utils/hooks/useFetch';
import { getLanguageString } from '../utils/translation-helpers';
import { AutocompleteTextField } from './AutocompleteTextField';

interface NfrProjectSearchProps extends Pick<TextFieldProps, 'onBlur' | 'required' | 'name' | 'sx'> {
  onSelectProject: (selectedProject: NfrProject | null) => void;
  errorMessage?: string;
}

export const NfrProjectSearch = ({ onSelectProject, errorMessage, ...textFieldProps }: NfrProjectSearchProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [nfrProjectSearch, isLoadingNfrProjectSearch] = useFetch<SearchResponse<NfrProject>>({
    url: debouncedSearchTerm ? `${VerifiedFundingApiPath.Nfr}?term=${debouncedSearchTerm}&size=20` : '',
    errorMessage: t('feedback.error.search'),
  });
  const nfrProjects = nfrProjectSearch?.hits ?? [];

  return (
    <Autocomplete
      options={nfrProjects}
      filterOptions={(options) => options}
      onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
      getOptionLabel={(option) => getLanguageString(option.labels)}
      renderOption={(props, option) => {
        const projectName = getLanguageString(option.labels);
        const period = getPeriodString(option.activeFrom, option.activeTo);
        const manager = option.lead ? `${t('project.project_manager')}: ${option.lead}` : '';
        return (
          <li {...props} key={option.identifier}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{projectName}</Typography>
              <Typography variant="body1">{period}</Typography>
              <Typography variant="body2">{manager}</Typography>
            </Box>
          </li>
        );
      }}
      onChange={(_, value) => onSelectProject(value)}
      loading={isLoadingNfrProjectSearch}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          {...textFieldProps}
          data-testid={dataTestId.registrationWizard.description.nfrProjectSearchField}
          label={t('registration.description.funding.nfr_project')}
          isLoading={isLoadingNfrProjectSearch}
          placeholder={t('registration.description.funding.nfr_project_search')}
          showSearchIcon
          errorMessage={errorMessage}
        />
      )}
    />
  );
};

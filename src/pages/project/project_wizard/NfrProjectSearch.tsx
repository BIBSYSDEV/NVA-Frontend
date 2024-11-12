import { Autocomplete, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNfrProjectSearch } from '../../../api/hooks/useNfrProjectSearch';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { NfrProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../utils/translation-helpers';
import { NfrProjectOption } from './NfrProjectOption';

interface NfrProjectSearchProps {
  selectedProject: NfrProject | null;
  setSelectedProject: (val: NfrProject | null) => void;
}

export const NfrProjectSearch = ({ selectedProject, setSelectedProject }: NfrProjectSearchProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [nfrProjectSearch, isLoadingNfrProjectSearch] = useNfrProjectSearch(debouncedSearchTerm);
  const nfrProjects = nfrProjectSearch?.hits ?? [];

  return (
    <>
      <Autocomplete
        data-testid={dataTestId.newProjectPage.nrfProjectSearchInput}
        options={nfrProjects}
        filterOptions={(options) => options}
        getOptionLabel={(option) => getLanguageString(option.labels)}
        onInputChange={(_, newInputValue, reason) => {
          if (reason !== 'reset') {
            // Autocomplete triggers "reset" events after input change when it's controlled. Ignore these.
            setSearchTerm(newInputValue);
          }
        }}
        inputValue={searchTerm}
        onChange={(_, value) => {
          if (value?.id) {
            setSearchTerm('');
            setSelectedProject(value);
          }
        }}
        popupIcon={null}
        clearIcon={null}
        value={null}
        loading={isLoadingNfrProjectSearch}
        renderInput={(params) => (
          <AutocompleteTextField
            {...params}
            label={t('project.new_project.nfr_grant')}
            isLoading={isLoadingNfrProjectSearch}
            placeholder={t('project.new_project.search_for_project_name_or_placeholder')}
            showSearchIcon={debouncedSearchTerm.length === 0}
          />
        )}
        renderOption={({ key, ...props }, option: NfrProject) => (
          <li {...props} key={option.identifier}>
            <NfrProjectOption project={option} />
          </li>
        )}
      />
      {selectedProject && (
        <>
          <Typography sx={{ fontWeight: 'bold', mt: '1rem' }}>{t('project.grant')}</Typography>
          <Typography>{getLanguageString(selectedProject.labels)}</Typography>
        </>
      )}
    </>
  );
};

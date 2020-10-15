import React, { FC, useCallback, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import { CristinProject } from '../../types/project.types';
import { debounce } from '../../utils/debounce';
import { getProjectTitle } from './helpers';
import ProjectChip from './ProjectChip';
import useFetchProjects from '../../utils/hooks/useFetchProjects';
import ProjectOption from './ProjectOption';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

export const ProjectSearch: FC = () => {
  const { t } = useTranslation('publication');
  const [value, setValue] = useState<CristinProject[]>([]);
  const [projects, isLoadingProjects, handleNewSearchTerm] = useFetchProjects('');

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      handleNewSearchTerm(searchTerm);
    }),
    []
  );

  return (
    <Autocomplete
      options={projects}
      noOptionsText={t('common:no_hits')}
      loadingText={`${t('common:loading')}...`}
      getOptionLabel={(option) => getProjectTitle(option)}
      onInputChange={(_, newInputValue) => {
        debouncedSearch(newInputValue);
      }}
      onChange={(_, value) => {
        setValue(value);
      }}
      multiple
      renderTags={(value: CristinProject[], getTagProps) =>
        value.map((option: CristinProject, index: number) => (
          <ProjectChip project={option} {...getTagProps({ index })} />
        ))
      }
      getOptionDisabled={(option) => value.some((val) => val.cristinProjectId === option.cristinProjectId)}
      loading={isLoadingProjects}
      renderOption={(option, state) => <ProjectOption project={option} state={state} />}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          placeholder={t('description.search_for_project')}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === 'Backspace') {
              // Disable removing chips with backspace
              event.stopPropagation();
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {params.InputProps.startAdornment}
                <StyledSearchIcon />
              </>
            ),
            endAdornment: (
              <>
                {isLoadingProjects && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ProjectSearch;

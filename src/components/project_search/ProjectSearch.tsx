import React, { FC, useCallback, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import { CristinProject, ResearchProject } from '../../types/project.types';
import { debounce } from '../../utils/debounce';
import { getProjectTitle } from './helpers';
import ProjectChip from './ProjectChip';
import useFetchProjects from '../../utils/hooks/useFetchProjects';
import ProjectOption from './ProjectOption';
import { useFormikContext } from 'formik';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { BackendTypeNames } from '../../types/publication_types/commonPublication.types';
import { Publication } from '../../types/publication.types';

const StyledSearchIcon = styled(SearchIcon)`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.text.disabled};
`;

export const ProjectSearch: FC = () => {
  const { t } = useTranslation('publication');
  const [projects, isLoadingProjects, handleNewSearchTerm] = useFetchProjects('');
  const { setFieldValue, values } = useFormikContext<Publication>();

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
        const projectToPersist = value[0] ? convertToProject(value[0]) : undefined;
        setFieldValue(DescriptionFieldNames.PROJECT, projectToPersist);
      }}
      multiple
      defaultValue={values.project ? [values.project].map((project) => convertToCristinProject(project)) : []}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => <ProjectChip project={option} {...getTagProps({ index })} />)
      }
      getOptionDisabled={(option) => values.project?.id === option.cristinProjectId}
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

const convertToProject = (project: CristinProject): ResearchProject => ({
  type: BackendTypeNames.RESEARCH_PROJECT,
  id: project.cristinProjectId,
  name: project.titles[0].title,
  grants: [],
  approvals: [],
});

const convertToCristinProject = (project: ResearchProject): CristinProject => ({
  cristinProjectId: project.id,
  mainLanguage: 'no',
  titles: [{ language: 'no', title: project.name }],
  participants: [],
  institutions: [],
  fundings: [],
});

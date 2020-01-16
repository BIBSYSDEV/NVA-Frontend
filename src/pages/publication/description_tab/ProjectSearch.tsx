import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { searchProjectsByTitle } from '../../../api/projectApi';
import AutoSearch from '../../../components/AutoSearch';
import { Project } from '../../../types/project.types';
import useDebounce from '../../../utils/hooks/useDebounce';
import { MINIMUM_SEARCH_CHARACTERS } from '../../../utils/constants';
import { useFormikContext } from 'formik';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const { values } = useFormikContext();

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await searchProjectsByTitle(searchTerm, dispatch);
      if (response) {
        const unselectedProjects = response.filter(
          (project: any) =>
            !values.projects.some(
              (selectedProject: any) => selectedProject.cristinProjectId === project.cristinProjectId
            )
        );

        setSearchResults(
          unselectedProjects.map((project: Project) => {
            return { ...project, title: project.titles?.[0]?.title };
          })
        );
      } else {
        setSearchResults([]);
      }
    },
    [dispatch, values.projects]
  );

  useEffect(() => {
    if (debouncedSearchTerm && !searching && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS) {
      search(debouncedSearchTerm);
      setSearching(false);
    }
  }, [debouncedSearchTerm, search, searching]);

  return (
    <AutoSearch
      dataTestId={dataTestId}
      onInputChange={(_, value) => setSearchTerm(value)}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      placeholder={placeholder}
    />
  );
};

export default ProjectSearch;

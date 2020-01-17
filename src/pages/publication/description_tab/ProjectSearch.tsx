import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { searchProjectsByTitle } from '../../../api/projectApi';
import AutoSearch from '../../../components/AutoSearch';
import { Project } from '../../../types/project.types';
import { debounce } from '../../../utils/debounce';
import { useFormikContext } from 'formik';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await searchProjectsByTitle(searchTerm, dispatch);
      if (response) {
        const unselectedProjects = response.filter(
          (project: Project) =>
            !values.projects.some(
              (selectedProject: any) => selectedProject.cristinProjectId === project.cristinProjectId
            )
        );

        setSearchResults(
          unselectedProjects
            .filter((project: Project) => project.titles?.length)
            .map((project: Project) => {
              return { ...project, title: project.titles?.[0]?.title };
            })
        );
      } else {
        setSearchResults([]);
      }
    }),
    [dispatch]
  );

  return (
    <AutoSearch
      dataTestId={dataTestId}
      onInputChange={debouncedSearch}
      searchResults={searchResults}
      setValueFunction={setValueFunction}
      placeholder={placeholder}
    />
  );
};

export default ProjectSearch;

import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { searchProjectsByTitle } from '../../../api/projectApi';
import AutoSearch from '../../../components/AutoSearch';
import { Project } from '../../../types/project.types';
import { debounce } from '../../../utils/debounce';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const dispatch = useDispatch();

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await searchProjectsByTitle(searchTerm, dispatch);
      if (response) {
        setSearchResults(
          response.map((project: Project) => {
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

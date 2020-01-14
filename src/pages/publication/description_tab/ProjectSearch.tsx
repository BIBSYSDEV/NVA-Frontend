import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { searchProjects } from '../../../api/projectApi';
import AutoSearch from '../../../components/AutoSearch';
import { Project } from '../../../types/project.types';
import useDebounce from '../../../utils/hooks/useDebounce';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await searchProjects(`title=${searchTerm}`, dispatch);
      if (response) {
        setSearchResults(
          response.map((project: Project) => {
            return { ...project, title: project.titles[0].title };
          })
        );
      } else {
        setSearchResults([]);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (debouncedSearchTerm && !searching) {
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
      clearOnSelect
    />
  );
};

export default ProjectSearch;

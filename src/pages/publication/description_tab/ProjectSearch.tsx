import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { searchProjects } from '../../../api/external/projectApi';
import AutoSearch from '../../../components/AutoSearch';
import { ProjectType, Project } from '../../../types/project.types';
import useDebounce from '../../../utils/hooks/useDebounce';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  value: string;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, value, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await searchProjects(`title=${searchTerm}`, dispatch);
      if (response) {
        const normalizedResponse = response.map((project: ProjectType) => ({
          id: project.project_id,
          title: `${project.title[project.main_language]} (${project.main_language})`,
        }));
        setSearchResults(normalizedResponse);
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
      label={t('publication:description.project')}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default ProjectSearch;

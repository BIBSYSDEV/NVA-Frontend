import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { searchCristinProjects } from '../../../api/external/cristinProjectApi';
import AutoSearch from '../../../components/AutoSearch';
import { CristinProjectType, Project } from '../../../types/project.types';
import useDebounce from '../../../utils/hooks/useDebounce';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  value: string;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, value }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await searchCristinProjects(`title=${searchTerm}`, dispatch);
      if (response) {
        const normalizedResponse = response.map((project: CristinProjectType) => ({
          id: project.cristin_project_id,
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
    />
  );
};

export default ProjectSearch;

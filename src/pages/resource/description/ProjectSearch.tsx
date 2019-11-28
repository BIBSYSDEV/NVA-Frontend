import React, { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../../utils/hooks/useDebounce';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AutoSearch from '../../../components/AutoSearch';
import { searchCristinProjects } from '../../../api/external/cristinProjectApi';
import { CristinProjectType, NormalizedProjectType } from '../../../types/project.types';

interface ProjectSearchProps {
  setFieldValue: (name: string, value: any) => void;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ setFieldValue }) => {
  const [searchResults, setSearchResults] = useState<NormalizedProjectType[]>([]);
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
      onInputChange={(_, value) => setSearchTerm(value)}
      searchResults={searchResults}
      setFieldValue={value => setFieldValue('project', value)}
      label={t('resource_form.project')}
    />
  );
};

export default ProjectSearch;

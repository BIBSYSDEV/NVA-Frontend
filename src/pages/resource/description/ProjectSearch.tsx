import React, { useCallback, useEffect, useState } from 'react';
import { PublicationChannel } from '../../../types/references.types';
import useDebounce from '../../../utils/hooks/useDebounce';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getPublicationChannels } from '../../../api/external/publicationChannelApi';
import { searchFailure } from '../../../redux/actions/searchActions';
import AutoSearch from '../../../components/AutoSearch';
import { MINIMUM_SEARCH_CHARACTERS } from '../../../utils/constants';
import CristinProjectType from '../../../types/cristin_project.types';
import { searchCristinProjects } from '../../../api/cristinProjectApi';

interface ProjectSearchProps {
  setFieldValue: (name: string, value: any) => void;
}

interface normalizedResult {
  cristin_project_id: string;
  title: string;
  main_language: string;
  url: string;
}

export const ProjectSearch: React.FC<ProjectSearchProps> = ({ setFieldValue }) => {
  const [searchResults, setSearchResults] = useState<CristinProjectType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');

  const search = useCallback(
    async (searchTerm: string) => {
      setSearching(true);
      const response = await searchCristinProjects(`title=${searchTerm}`, dispatch);
      if (response) {
        const normalizedResponse = response.map((project: CristinProjectType) => {
          const normalizedProject: normalizedResult = {
            cristin_project_id: project.cristin_project_id,
            title: `${project.title[project.main_language]}(${project.main_language})`,
            main_language: project.main_language,
            url: project.url,
          };
          return normalizedProject;
        });
        console.log(normalizedResponse);
        setSearchResults(normalizedResponse);
      } else {
        dispatch(searchFailure(t('error.search')));
      }
    },
    [dispatch, t]
  );

  useEffect(() => {
    if (debouncedSearchTerm && !searching) {
      search(debouncedSearchTerm);
      setSearching(false);
    }
  }, [debouncedSearchTerm, search, searching]);

  const handleInputChange = (event: object, value: string) => {
    if (event !== null && value.length >= MINIMUM_SEARCH_CHARACTERS) {
      setSearchTerm(value);
    }
  };

  return (
    <AutoSearch
      onInputChange={handleInputChange}
      searchResults={searchResults}
      setFieldValue={(value: any) => setFieldValue('project', value)}
      label={t('Project')}
    />
  );
};

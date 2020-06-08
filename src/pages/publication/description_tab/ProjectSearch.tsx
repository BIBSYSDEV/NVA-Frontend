import React, { FC, useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import AutoSearch from '../../../components/AutoSearch';
import { Project, CristinProject, CristinProjectFunding } from '../../../types/project.types';
import { debounce } from '../../../utils/debounce';
import useFetchProjects from '../../../utils/hooks/useFetchProjects';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [projects, isLoadingProjects, handleNewSearchTerm] = useFetchProjects('');

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      handleNewSearchTerm(searchTerm);
    }),
    []
  );

  useEffect(() => {
    if (projects) {
      setSearchResults(
        projects.map((project: CristinProject) => ({
          id: project.cristinProjectId,
          name: project.titles?.[0]?.title,
          grants: project.fundings.map((funding: CristinProjectFunding) => ({
            id: funding.projectCode,
            source: funding.fundingSourceCode,
            type: 'Grant',
          })),
        }))
      );
    }
  }, [projects]);

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

import React, { FC, useCallback, useState, useEffect } from 'react';

import AutoSearch from '../../../components/AutoSearch';
import { Project, CristinProject, CristinProjectFunding } from '../../../types/project.types';
import { debounce } from '../../../utils/debounce';
import useFetchProjects from '../../../utils/hooks/useFetchProjects';
import { BackendTypeNames } from '../../../types/publication_types/common.publication.types';

interface ProjectSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const ProjectSearch: FC<ProjectSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [projects, , handleNewSearchTerm] = useFetchProjects('');

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
          type: BackendTypeNames.RESEARCH_PROJECT,
          id: project.cristinProjectId,
          name: project.titles?.[0]?.title,
          grants: project.fundings.map((funding: CristinProjectFunding) => ({
            id: funding.projectCode,
            source: funding.fundingSourceCode,
            type: BackendTypeNames.GRANT,
          })),
          approvals: [],
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

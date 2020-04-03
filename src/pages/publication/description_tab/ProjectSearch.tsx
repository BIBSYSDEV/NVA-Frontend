import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { searchProjectsByTitle } from '../../../api/projectApi';
import AutoSearch from '../../../components/AutoSearch';
import { Project, CristinProject, CristinProjectFunding } from '../../../types/project.types';
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
          response.map((project: CristinProject) => ({
            id: project.cristinProjectId,
            name: project.titles?.[0]?.title,
            grants: project.fundings.map((funding: CristinProjectFunding) => ({
              id: funding.projectCode,
              source: funding.fundingSourceCode,
            })),
          }))
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

import React, { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useFormikContext } from 'formik';
import { debounce } from '../../utils/debounce';
import AutoSearch from '../../components/AutoSearch';

interface InstituitionSearchProps {
  dataTestId: string;
  setValueFunction: (value: any) => void;
  placeholder?: string;
}

const InstituitionSearch: FC<InstituitionSearchProps> = ({ dataTestId, setValueFunction, placeholder }) => {
  const [searchResults, setSearchResults] = useState<Instituition[]>([]);
  const dispatch = useDispatch();
  const { values } = useFormikContext();

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await searchInstituitionsByName(searchTerm, dispatch);
      if (response) {
        const unselectedInstituitions = response.filter(
          (instituition: Instituition) =>
            !values.instituitions.some(
              (selectedInstituition: any) =>
                selectedInstituition.cristinInstituitionId === instituition.cristinInstituitionId
            )
        );

        setSearchResults(
          unselectedInstituitions
            .filter((instituition: Instituition) => instituition.titles?.length)
            .map((instituition: Instituition) => {
              return { ...instituition, title: instituition.titles?.[0]?.title };
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

export default InstituitionSearch;

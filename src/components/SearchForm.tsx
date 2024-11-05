import { Box, BoxProps, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../api/searchApi';
import { SearchTextField } from '../pages/search/SearchTextField';
import { dataSearchFieldAttributeName, SearchParam, syncParamsWithSearchFields } from '../utils/searchHelpers';

interface SearchFormProps extends Pick<BoxProps, 'sx'>, Pick<TextFieldProps, 'label' | 'placeholder'> {
  paramName?: string;
  dataTestId?: string;
}

export const SearchForm = ({ sx, label, placeholder, dataTestId, paramName = 'query' }: SearchFormProps) => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchTerm = searchParams.get(paramName) ?? '';

  const [inputValue, setInputValue] = useState(currentSearchTerm);

  // Update inputValue based on URL param. Used to clear value from parent component
  useEffect(() => {
    setInputValue(currentSearchTerm);
  }, [currentSearchTerm]);

  return (
    <Box
      sx={sx}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        const syncedParams = syncParamsWithSearchFields(searchParams);
        if (inputValue) {
          syncedParams.set(paramName, inputValue);
        } else {
          syncedParams.delete(paramName);
        }

        syncedParams.delete(ResultParam.From);
        syncedParams.delete(SearchParam.Page);

        history.push({ search: searchParams.toString() });
      }}>
      <SearchTextField
        inputProps={{ [dataSearchFieldAttributeName]: paramName }}
        dataTestId={dataTestId}
        name={paramName}
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
    </Box>
  );
};

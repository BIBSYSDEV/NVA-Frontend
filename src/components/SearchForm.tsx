import { Box, BoxProps, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SearchTextField } from '../pages/search/SearchTextField';
import { dataSearchFieldAttributeName, syncParamsWithSearchFields } from '../utils/searchHelpers';

interface SearchFormProps extends Pick<BoxProps, 'sx'>, Pick<TextFieldProps, 'label' | 'placeholder'> {
  paginationOffsetParamName: string;
  paramName?: string;
  dataTestId?: string;
}

export const SearchForm = ({
  sx,
  label,
  placeholder,
  dataTestId,
  paramName = 'query',
  paginationOffsetParamName,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
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

        syncedParams.delete(paginationOffsetParamName);
        navigate({ search: searchParams.toString() });
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

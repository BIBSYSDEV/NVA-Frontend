import { Box, BoxProps, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultParam } from '../api/searchApi';
import { SearchTextField } from '../pages/search/SearchTextField';
import { SearchParam } from '../utils/searchHelpers';

interface SearchFormProps extends Pick<BoxProps, 'sx'>, Pick<TextFieldProps, 'label' | 'placeholder'> {
  paramName?: string;
  dataTestId?: string;
}

export const SearchForm = ({ sx, label, placeholder, dataTestId, paramName = 'query' }: SearchFormProps) => {
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
        if (inputValue) {
          searchParams.set(paramName, inputValue);
        } else {
          searchParams.delete(paramName);
        }

        if (searchParams.get(ResultParam.From)) {
          searchParams.delete(ResultParam.From);
        } else if (searchParams.get(SearchParam.Page)) {
          searchParams.delete(SearchParam.Page);
        }

        navigate({ search: searchParams.toString() });
      }}>
      <SearchTextField
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

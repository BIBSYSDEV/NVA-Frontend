import { Box, BoxProps, TextFieldProps } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../api/searchApi';
import { SearchTextField } from '../pages/search/SearchTextField';
import { SearchParam } from '../utils/searchHelpers';

interface SearchFormProps extends Pick<BoxProps, 'sx'>, Pick<TextFieldProps, 'label' | 'placeholder'> {
  name?: string;
}

export const SearchForm = ({ sx, label, placeholder, name = 'query' }: SearchFormProps) => {
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const currentSearchTerm = searchParams.get(name);

  return (
    <Box
      sx={sx}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        const newSearchQuery = event.currentTarget[name]?.value ?? '';
        if (newSearchQuery) {
          searchParams.set(name, newSearchQuery);
        } else {
          searchParams.delete(name);
        }

        if (searchParams.get(ResultParam.From)) {
          searchParams.delete(ResultParam.From);
        } else if (searchParams.get(SearchParam.Page)) {
          searchParams.delete(SearchParam.Page);
        }

        history.push({ ...history.location, search: searchParams.toString() });
      }}>
      <SearchTextField name={name} label={label} placeholder={placeholder} defaultValue={currentSearchTerm} />
    </Box>
  );
};

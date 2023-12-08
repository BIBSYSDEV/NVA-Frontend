import { Box, BoxProps, TextFieldProps } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { SearchTextField } from '../pages/search/SearchTextField';

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
        const newSearchQuery = event.currentTarget.query.value;
        if (newSearchQuery) {
          searchParams.set(name, newSearchQuery);
        } else {
          searchParams.delete(name);
        }
        history.push({ ...history.location, search: searchParams.toString() });
      }}>
      <SearchTextField name={name} label={label} placeholder={placeholder} defaultValue={currentSearchTerm} />
    </Box>
  );
};

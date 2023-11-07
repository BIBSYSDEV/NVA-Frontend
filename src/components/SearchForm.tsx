import { Box, BoxProps, TextFieldProps } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { SearchTextField } from '../pages/search/SearchTextField';

type SearchFormProps = Pick<BoxProps, 'sx'> & Pick<TextFieldProps, 'label' | 'placeholder'>;

export const SearchForm = ({ sx, label, placeholder }: SearchFormProps) => {
  const history = useHistory();
  const currentSearchTerm = new URLSearchParams(history.location.search).get('query');

  return (
    <Box
      sx={sx}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        const searchQuery = event.currentTarget.query.value;
        history.push({ ...history.location, search: `?query=${searchQuery}` });
      }}>
      <SearchTextField name="query" label={label} placeholder={placeholder} defaultValue={currentSearchTerm} />
    </Box>
  );
};

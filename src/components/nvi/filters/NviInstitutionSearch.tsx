import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { dataTestId } from '../../../utils/dataTestIds';

/* Read and manipulate the value of the url parameter "institution" */
export const NviInstitutionSearch = (props: Partial<TextFieldProps>) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchPhrase = searchParams.get('institution') ?? '';

  const updateUrlParam = (value: string) => {
    const nextParams = new URLSearchParams(location.search);
    if (value) {
      nextParams.set('institution', value);
    } else {
      nextParams.delete('institution');
    }
    navigate({ search: nextParams.toString() });
  };

  return (
    <TextField
      {...props}
      type="search"
      label={t('common.institution')}
      data-testid={dataTestId.nviFilterInstitution}
      variant="outlined"
      size="small"
      aria-label={t('common.institution')}
      value={searchPhrase}
      onChange={(e) => updateUrlParam(e.target.value)}
      slotProps={{
        input: {
          startAdornment: <SearchIcon color="disabled" />,
          endAdornment: (
            <IconButton
              onClick={() => updateUrlParam('')}
              title={t('common.clear')}
              size="small"
              data-testid={dataTestId.nviFilterInstitutionClearSearch}>
              <ClearIcon />
            </IconButton>
          ),
        },
      }}
    />
  );
};

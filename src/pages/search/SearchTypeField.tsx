import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SearchParam } from '../../utils/searchHelpers';

export enum SearchTypeValue {
  Result = 'result',
  Person = 'person',
  Project = 'project',
}

export const SearchTypeField = ({ sx = {} }: Pick<TextFieldProps, 'sx'>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  return (
    <TextField
      select
      value={!paramsSearchType ? SearchTypeValue.Result : paramsSearchType}
      size="small"
      sx={{
        minWidth: '9rem',
        '.MuiSelect-select': {
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          bgcolor: personIsSeleced || projectIsSelected ? `${paramsSearchType}.main` : 'registration.main',
        },
        ...sx,
      }}
      slotProps={{ htmlInput: { 'aria-label': t('common.type') } }}>
      <MenuItem
        sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        value={SearchTypeValue.Result}
        onClick={() => {
          if (!resultIsSelected) {
            const resultParams = new URLSearchParams();
            history.push({ search: resultParams.toString() });
          }
        }}>
        <NotesIcon fontSize="small" />
        {t('search.result')}
      </MenuItem>
      <MenuItem
        sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        value={SearchTypeValue.Person}
        onClick={() => {
          if (!personIsSeleced) {
            const personParams = new URLSearchParams();
            personParams.set(SearchParam.Type, SearchTypeValue.Person);
            history.push({ search: personParams.toString() });
          }
        }}>
        <PersonIcon fontSize="small" />
        {t('search.persons')}
      </MenuItem>
      <MenuItem
        sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        value={SearchTypeValue.Project}
        onClick={() => {
          if (!projectIsSelected) {
            const projectParams = new URLSearchParams();
            projectParams.set(SearchParam.Type, SearchTypeValue.Project);
            history.push({ search: projectParams.toString() });
          }
        }}>
        <ShowChartIcon fontSize="small" />
        {t('project.project')}
      </MenuItem>
    </TextField>
  );
};

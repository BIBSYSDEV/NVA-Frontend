import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { PersonSearchParameter, ProjectSearchParameter } from '../../api/cristinApi';
import { ResultParam } from '../../api/searchApi';
import { dataTestId } from '../../utils/dataTestIds';
import { SearchParam, syncParamsWithSearchFields } from '../../utils/searchHelpers';

export enum SearchTypeValue {
  Result = 'registration',
  Person = 'person',
  Project = 'project',
}

const getSyncedSearchTerm = (params: URLSearchParams, searchType: SearchTypeValue) => {
  const syncedParams = syncParamsWithSearchFields(params);
  switch (searchType) {
    case SearchTypeValue.Result:
      return syncedParams.get(ResultParam.Query);
    case SearchTypeValue.Person:
      return syncedParams.get(PersonSearchParameter.Name);
    case SearchTypeValue.Project:
      return syncedParams.get(ProjectSearchParameter.Query);
    default:
      return '';
  }
};

export const SearchTypeField = ({ sx = {} }: Pick<TextFieldProps, 'sx'>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsSearchType = (params.get(SearchParam.Type) as SearchTypeValue | null) ?? SearchTypeValue.Result;

  const resultIsSelected = !paramsSearchType || paramsSearchType === SearchTypeValue.Result;
  const personIsSeleced = paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = paramsSearchType === SearchTypeValue.Project;

  return (
    <TextField
      select
      value={!paramsSearchType ? SearchTypeValue.Result : paramsSearchType}
      size="small"
      data-testid={dataTestId.startPage.searchTypeField}
      sx={{
        minWidth: '9rem',
        '.MuiSelect-select': {
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          bgcolor: `${paramsSearchType}.main`,
          color: 'white',
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
            const searchTerm = getSyncedSearchTerm(params, paramsSearchType);
            if (searchTerm) {
              resultParams.set(ResultParam.Query, searchTerm);
            }
            navigate({ search: resultParams.toString() });
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
            const personParams = new URLSearchParams({ [SearchParam.Type]: SearchTypeValue.Person });
            const searchTerm = getSyncedSearchTerm(params, paramsSearchType);
            if (searchTerm) {
              personParams.set(PersonSearchParameter.Name, searchTerm);
            }
            navigate({ search: personParams.toString() });
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
            const projectParams = new URLSearchParams({ [SearchParam.Type]: SearchTypeValue.Project });
            const searchTerm = getSyncedSearchTerm(params, paramsSearchType);
            if (searchTerm) {
              projectParams.set(ProjectSearchParameter.Query, searchTerm);
            }
            navigate({ search: projectParams.toString() });
          }
        }}>
        <ShowChartIcon fontSize="small" />
        {t('project.project')}
      </MenuItem>
    </TextField>
  );
};

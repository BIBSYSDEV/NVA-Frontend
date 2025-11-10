import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { NviCandidatesSearchParam } from '../../../api/searchApi';

enum DisplayOptions {
  ShowAllUnits = 'show_all_units',
  ShowOnlyUnitsWithCandidates = 'show_only_units_with_candidates',
}

export const NviVisibilitySelector = (props: Partial<TextFieldProps>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const options = [
    {
      value: DisplayOptions.ShowAllUnits,
      label: t(DisplayOptions.ShowAllUnits),
    },
    {
      value: DisplayOptions.ShowOnlyUnitsWithCandidates,
      label: t(DisplayOptions.ShowOnlyUnitsWithCandidates),
    },
  ];
  const { excludeEmptyRows } = useNviCandidatesParams();
  const searchParams = new URLSearchParams(location.search);
  const selectedValue = excludeEmptyRows ? DisplayOptions.ShowOnlyUnitsWithCandidates : DisplayOptions.ShowAllUnits;

  return (
    <TextField
      select
      data-testid={dataTestId.tasksPage.nvi.visibilitySelect}
      size="small"
      value={selectedValue}
      label={t('visibility')}
      onChange={(event) => {
        const excludeEmptyRows = event.target.value === DisplayOptions.ShowOnlyUnitsWithCandidates;
        const syncedParams = syncParamsWithSearchFields(searchParams);
        if (excludeEmptyRows) {
          syncedParams.set(NviCandidatesSearchParam.ExcludeEmptyRows, excludeEmptyRows.toString());
        } else {
          syncedParams.delete(NviCandidatesSearchParam.ExcludeEmptyRows);
        }
        navigate({ search: syncedParams.toString() });
      }}
      {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

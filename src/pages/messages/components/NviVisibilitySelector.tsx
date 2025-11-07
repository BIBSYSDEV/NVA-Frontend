import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';

interface NviVisibilitySelectorProps {
  hideEmptyRows: boolean;
  setHideEmptyRows: (val: boolean) => void;
}

enum DisplayOptions {
  ShowAllUnits = 'show_all_units',
  ShowAllUnitsWithCandidates = 'show_all_units_with_candidates',
}

export const NviVisibilitySelector = ({
  setHideEmptyRows,
  hideEmptyRows,
  ...props
}: NviVisibilitySelectorProps & Partial<TextFieldProps>) => {
  const { t } = useTranslation();
  const options = [
    {
      value: DisplayOptions.ShowAllUnits,
      label: t(DisplayOptions.ShowAllUnits),
    },
    {
      value: DisplayOptions.ShowAllUnitsWithCandidates,
      label: t(DisplayOptions.ShowAllUnitsWithCandidates),
    },
  ];
  const selectedValue = hideEmptyRows ? DisplayOptions.ShowAllUnitsWithCandidates : DisplayOptions.ShowAllUnits;

  // TODO url access

  return (
    <TextField
      select
      data-testid={dataTestId.tasksPage.nvi.yearSelect}
      size="small"
      value={selectedValue}
      label={t('visibility')}
      onChange={(event) => {
        setHideEmptyRows(event.target.value === DisplayOptions.ShowAllUnitsWithCandidates);
      }}
      {...props}>
      {options.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

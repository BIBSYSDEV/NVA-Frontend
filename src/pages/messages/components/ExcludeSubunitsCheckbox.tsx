import { Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { dataTestId } from '../../../utils/dataTestIds';

interface ExcludeSubunitsCheckboxProps {
  paramName: string;
  paginationParamName: string;
  disabled?: boolean;
}

export const ExcludeSubunitsCheckbox = ({ paramName, paginationParamName, disabled }: ExcludeSubunitsCheckboxProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSelected = searchParams.get(paramName) === 'true';

  return (
    <FormControlLabel
      data-testid={dataTestId.tasksPage.nvi.excludeSubunitsCheckbox}
      onChange={(_, checked) => {
        if (checked) {
          searchParams.set(paramName, checked.toString());
        } else {
          searchParams.delete(paramName);
        }
        searchParams.delete(paginationParamName);
        navigate({ search: searchParams.toString() });
      }}
      disabled={disabled}
      label={t('tasks.nvi.exclude_subunits')}
      control={<Checkbox checked={isSelected} />}
    />
  );
};

import { Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

interface ExcludeSubunitsCheckboxProps {
  paramName: string;
  paginationParamName: string;
  disabled: boolean;
}

export const ExcludeSubunitsCheckbox = ({ paramName, paginationParamName, disabled }: ExcludeSubunitsCheckboxProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <FormControlLabel
      data-testid={dataTestId.tasksPage.nvi.excludeSubunitsCheckbox}
      onChange={(_, checked) => {
        setSearchParams((prev) => {
          const syncedParams = syncParamsWithSearchFields(prev);
          if (checked) {
            syncedParams.set(paramName, checked.toString());
          } else {
            syncedParams.delete(paramName);
          }
          syncedParams.delete(paginationParamName);
          return syncedParams;
        });
      }}
      disabled={disabled}
      label={t('tasks.nvi.exclude_subunits')}
      control={<Checkbox checked={searchParams.get(paramName) === 'true'} />}
    />
  );
};

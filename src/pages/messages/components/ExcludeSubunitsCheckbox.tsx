import { Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExcludeSubunitsCheckbox = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { excludeSubUnits, affiliations } = useNviCandidatesParams();

  const disableExcludeSubUnits = affiliations === null || affiliations.length === 0;

  return (
    <FormControlLabel
      data-testid={dataTestId.tasksPage.nvi.excludeSubunitsCheckbox}
      onChange={(_, checked) => {
        if (checked) {
          searchParams.set(NviCandidatesSearchParam.ExcludeSubUnits, checked.toString());
        } else {
          searchParams.delete(NviCandidatesSearchParam.ExcludeSubUnits);
        }
        searchParams.delete(NviCandidatesSearchParam.Offset);
        navigate({ search: searchParams.toString() });
      }}
      disabled={disableExcludeSubUnits}
      label={t('tasks.nvi.exclude_subunits')}
      control={<Checkbox checked={excludeSubUnits} />}
    />
  );
};

import { Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

export const ExcludeSubunitsCheckbox = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const { excludeSubUnits, affiliations } = useNviCandidatesParams();

  const disableExcludeSubUnits = affiliations === null || affiliations.length === 0;

  return (
    <FormControlLabel
      onChange={(_, checked) => {
        if (checked) {
          searchParams.set(NviCandidatesSearchParam.ExcludeSubUnits, checked.toString());
        } else {
          searchParams.delete(NviCandidatesSearchParam.ExcludeSubUnits);
        }
        searchParams.delete(NviCandidatesSearchParam.Offset);
        history.push({ search: searchParams.toString() });
      }}
      disabled={disableExcludeSubUnits}
      label={t('tasks.nvi.exclude_subunits')}
      control={<Checkbox checked={excludeSubUnits} />}
    />
  );
};

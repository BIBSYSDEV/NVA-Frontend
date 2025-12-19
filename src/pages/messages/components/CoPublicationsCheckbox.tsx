import { Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { NviCandidateFilterEnum, NviCandidatesSearchParam } from '../../../api/searchApi';

export const CoPublicationsCheckbox = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <FormControlLabel
      data-testid={dataTestId.tasksPage.nvi.visibilityCheckbox}
      onChange={(_, checked) => {
        setSearchParams((prev) => {
          const syncedParams = syncParamsWithSearchFields(prev);
          if (checked) {
            syncedParams.set(NviCandidatesSearchParam.Filter, NviCandidateFilterEnum.Collaboration);
          } else {
            syncedParams.delete(NviCandidatesSearchParam.Filter);
          }
          syncedParams.delete(NviCandidatesSearchParam.Offset);
          return syncedParams;
        });
      }}
      label={t('tasks.nvi.show_only_collaborative_publications')}
      control={
        <Checkbox
          checked={searchParams.get(NviCandidatesSearchParam.Filter) === NviCandidateFilterEnum.Collaboration}
        />
      }
    />
  );
};

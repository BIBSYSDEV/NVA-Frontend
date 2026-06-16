import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { NviCandidatesSearchParam } from '../../../../../../api/searchApi';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../../../../utils/searchHelpers';

export const IncludeCandidatesWithoutCuratorCheckbox = () => {
  const { t } = useTranslation();
  const nviParams = useNviCandidatesParams();
  const [, setSearchParams] = useSearchParams();

  return (
    <Button
      fullWidth
      variant="outlined"
      sx={{ bgcolor: 'white' }}
      data-testid={dataTestId.tasksPage.nvi.excludeUnassignedButton}
      startIcon={
        !nviParams.excludeUnassigned ? (
          <CheckBoxIcon color="secondary" />
        ) : (
          <CheckBoxOutlineBlankIcon color="secondary" />
        )
      }
      onClick={() => {
        setSearchParams((params) => {
          const syncedParams = syncParamsWithSearchFields(params);
          syncedParams.delete(NviCandidatesSearchParam.Offset);
          if (nviParams.excludeUnassigned) {
            syncedParams.delete(NviCandidatesSearchParam.ExcludeUnassigned);
          } else {
            syncedParams.set(NviCandidatesSearchParam.ExcludeUnassigned, 'true');
          }
          return syncedParams;
        });
      }}>
      {t('tasks.nvi.include_candidates_without_curator')}
    </Button>
  );
};

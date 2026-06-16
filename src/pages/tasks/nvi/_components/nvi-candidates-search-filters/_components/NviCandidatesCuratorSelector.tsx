import { useNavigate, useSearchParams } from 'react-router';
import { NviCandidatesSearchParam } from '../../../../../../api/searchApi';
import { CuratorSelector } from '../../../../../../components/filters/CuratorSelector';
import { RoleName } from '../../../../../../types/user.types';
import { useNviCandidatesParams } from '../../../../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../../../../utils/searchHelpers';

export const NviCandidatesCuratorSelector = () => {
  const nviParams = useNviCandidatesParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <CuratorSelector
      selectedUsername={nviParams.assignee}
      onChange={(curator) => {
        const syncedParams = syncParamsWithSearchFields(searchParams);
        syncedParams.delete(NviCandidatesSearchParam.Offset);
        if (curator) {
          syncedParams.set(NviCandidatesSearchParam.Assignee, curator.username);
        } else {
          syncedParams.delete(NviCandidatesSearchParam.Assignee);
        }
        navigate({ search: syncedParams.toString() });
      }}
      roleFilter={[RoleName.NviCurator]}
    />
  );
};

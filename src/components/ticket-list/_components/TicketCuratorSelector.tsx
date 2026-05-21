import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { TicketSearchParam } from '../../../api/searchApi';
import { RootState } from '../../../redux/store';
import { RoleName } from '../../../types/user.types';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { CuratorSelector } from '../../CuratorSelector';
import { useTicketsParams } from '../_hooks/useTicketsParams';

const relevantRoleFilterOptions = [
  RoleName.SupportCurator,
  RoleName.PublishingCurator,
  RoleName.DoiCurator,
  RoleName.CuratorThesis,
  RoleName.CuratorThesisEmbargo,
];

const getRoleFilterOptions = (roles: RoleName[]) => roles.filter((role) => relevantRoleFilterOptions.includes(role));

export const TicketCuratorSelector = () => {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { assignee } = useTicketsParams();

  return (
    <CuratorSelector
      selectedUsername={assignee}
      onChange={(curator) => {
        const syncedParams = syncParamsWithSearchFields(searchParams);
        if (curator) {
          syncedParams.set(TicketSearchParam.Assignee, curator.username);
        } else {
          syncedParams.delete(TicketSearchParam.Assignee);
        }

        syncedParams.delete(TicketSearchParam.From);
        navigate({ search: syncedParams.toString() });
      }}
      roleFilter={getRoleFilterOptions(user?.roles ?? [])}
    />
  );
};

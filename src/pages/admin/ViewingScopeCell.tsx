import { TableCell } from '@mui/material';
import { Organization } from '../../types/institution.types';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { getLanguageString } from '../../utils/translation-helpers';

interface ViewingScopeCellProps {
  id: string;
}

export const ViewingScopeCell = ({ id }: ViewingScopeCellProps) => {
  const [organization] = useFetchResource<Organization>(id); // Some user can have an outdated id, returning something else than Organization
  return <TableCell>{organization?.name ? getLanguageString(organization.name) : null}</TableCell>;
};

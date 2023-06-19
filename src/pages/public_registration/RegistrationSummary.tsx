import { Link } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { RegistrationFieldName } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';
import { getTitleString } from '../../utils/registration-helpers';

interface RegistrationSummaryProps {
  id: string;
}

export const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const identifier = getIdentifierFromId(id);
  const [searchContainer, isLoadingSearchContainer] = useSearchRegistrations({
    properties: [
      { fieldName: RegistrationFieldName.Identifier, value: identifier, operator: ExpressionStatement.Contains },
    ],
  });

  const container = searchContainer && searchContainer.hits.length === 1 ? searchContainer.hits[0] : null;

  return isLoadingSearchContainer ? (
    <Skeleton width={400} />
  ) : (
    container && (
      <Link component={RouterLink} to={getRegistrationLandingPagePath(identifier)}>
        {getTitleString(container.entityDescription?.mainTitle)}
      </Link>
    )
  );
};

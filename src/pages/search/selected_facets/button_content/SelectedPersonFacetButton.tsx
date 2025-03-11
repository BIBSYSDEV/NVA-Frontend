import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchPersonByIdentifier } from '../../../../api/hooks/useFetchPerson';
import { getFullCristinName } from '../../../../utils/user-helpers';

interface SelectedContributorFacetButtonProps {
  personIdentifier: string;
}

export const SelectedPersonFacetButton = ({ personIdentifier }: SelectedContributorFacetButtonProps) => {
  const { t } = useTranslation();

  const personQuery = useFetchPersonByIdentifier(personIdentifier);
  const personName = getFullCristinName(personQuery.data?.names) || t('common.unknown');

  return <>{personQuery.isPending ? <Skeleton sx={{ width: '7rem', ml: '0.25rem' }} /> : personName}</>;
};

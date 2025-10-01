import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchCustomers } from '../../../api/hooks/useFetchCustomers';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { PageSpinner } from '../../../components/PageSpinner';
import { Organization } from '../../../types/organization.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface InstitutionsServiceCenterOverviewProps {
  institutions: Organization[];
}

export const InstitutionsServiceCenterOverview = ({ institutions }: InstitutionsServiceCenterOverviewProps) => {
  const { t } = useTranslation();
  const customersData = useFetchCustomers({ enabled: institutions.length > 0, staleTime: 1_800_000 }); // Cache for 30 minutes
  const customers = customersData.data?.customers ?? [];

  const institutionsWithServiceCenter = institutions.filter((institution) =>
    customers.some((customer) => customer.cristinId === institution.id && customer.serviceCenterUri)
  );

  if (institutions.length === 0 || institutionsWithServiceCenter.length === 0) {
    return null;
  }

  if (customersData.isEnabled && customersData.isPending) {
    return <PageSpinner aria-label={t('institutions_service_support')} />;
  }

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t('institutions_service_support')}
      </Typography>
      <ul style={{ padding: 0 }}>
        {institutionsWithServiceCenter.map((institution) => {
          const serviceCenterUri = customers.find(
            (customer) => customer.cristinId === institution.id
          )?.serviceCenterUri;

          return (
            <li style={{ marginBottom: '1rem', marginLeft: 0, listStyleType: 'none' }} key={institution.id}>
              <Typography>{getLanguageString(institution.labels)}</Typography>
              {serviceCenterUri && <OpenInNewLink href={serviceCenterUri}>{serviceCenterUri}</OpenInNewLink>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

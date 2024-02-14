import { Grid, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchOrganization } from '../../../api/cristinApi';
import { Organization } from '../../../types/organization.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { PageSpinner } from '../../../components/PageSpinner';
import { useEffect, useState } from 'react';
import { getUnitTopLevelCode } from '../../../utils/institutions-helpers';
import { useTranslation } from 'react-i18next';

interface CustomerInstitutionInformationFromCristinProps {
  cristinId: string | undefined;
  customerData: Organization | null;
  setName: (string: string) => void;
  displayName: string | undefined;
}

export const CustomerInstitutionInformationFromCristin = ({
  cristinId,
  customerData,
  setName,
  displayName,
}: CustomerInstitutionInformationFromCristinProps) => {
  const { t } = useTranslation();
  const [topLevelCristinCode, setTopLevelCristinCode] = useState<string | null>();
  const customerInformationFromCristinQuery = useQuery({
    queryKey: ['organization', cristinId, customerData],
    enabled: !!cristinId && !customerData,
    queryFn: () => {
      if (cristinId && !customerData) {
        return fetchOrganization(cristinId);
      }
    },
  });

  useEffect(() => {
    setTopLevelCristinCode(getUnitTopLevelCode(cristinId));
  }, [cristinId]);

  const customerInformation = customerData ?? customerInformationFromCristinQuery.data;
  const displayNameFromCristin = getLanguageString(customerData?.labels, 'nb');
  if (displayName !== displayNameFromCristin && displayNameFromCristin.length > 0) {
    setName(displayNameFromCristin);
  }

  return (
    <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} container spacing={2}>
      {!customerInformation && customerInformationFromCristinQuery.isFetching ? (
        <Grid item xs={12}>
          <PageSpinner />
        </Grid>
      ) : (
        <>
          <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} item xs={12} md={3}>
            <TextField
              label={t('basic_data.institutions.institution_norwegian_name')}
              fullWidth
              disabled
              value={displayName ?? ''}
              variant="filled"
            />
          </Grid>
          <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} item xs={12} md={3}>
            <TextField
              label={t('basic_data.institutions.institution_english_name')}
              fullWidth
              disabled
              value={customerInformation?.labels?.en ?? ''}
              variant="filled"
            />
          </Grid>
          <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} item xs={12} md={3}>
            <TextField
              disabled
              fullWidth
              value={customerInformation?.acronym ?? ''}
              variant="filled"
              label={t('basic_data.institutions.short_name')}
            />
          </Grid>
          <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} item xs={12} md={3}>
            <TextField
              disabled
              fullWidth
              value={topLevelCristinCode}
              variant="filled"
              label={t('basic_data.institutions.institution_toplevel_code')}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

import { Grid, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchOrganization } from '../../../api/cristinApi';
import { Organization } from '../../../types/organization.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { PageSpinner } from '../../../components/PageSpinner';
import { useEffect, useState } from 'react';

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
  const [topLevelCristinCode, setTopLevelCristinCode] = useState<string>();
  const customerInformationFromCristinQuery = useQuery({
    queryKey: ['organization', cristinId, customerData],
    enabled: !!cristinId,
    queryFn: () => {
      if (cristinId && !customerData) {
        return fetchOrganization(cristinId);
      }
    },
  });

  useEffect(() => {
    const snipToplevelOrganization = (cristinId: string) => {
      const cristinOrg = cristinId.replace('https://api.dev.nva.aws.unit.no/cristin/organization/', '');
      return cristinOrg.replace('.0.0.0', '');
    };

    const extractInstitutionTopLevelCode = (cristinId: string | undefined) => {
      return cristinId ? snipToplevelOrganization(cristinId) : undefined;
    };
    setTopLevelCristinCode(extractInstitutionTopLevelCode(cristinId));
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
            <TextField label={'Norsk navn'} fullWidth disabled value={displayName ?? ''} variant="filled" />
          </Grid>
          <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} item xs={12} md={3}>
            <TextField
              label={'Engelsk navn'}
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
              label={'Kortnavn'}
            />
          </Grid>
          <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} item xs={12} md={3}>
            <TextField disabled fullWidth value={topLevelCristinCode} variant="filled" label={'Kode'} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

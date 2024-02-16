import { Grid, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { PageSpinner } from '../../../components/PageSpinner';
import { Organization } from '../../../types/organization.types';
import { getUnitTopLevelCode } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface CustomerInstitutionInformationFromCristinProps {
  cristinId?: string;
  organizationData: Organization | null;
  setName: (string: string) => void;
  displayName?: string;
}

export const CustomerInstitutionInformationFromCristin = ({
  cristinId,
  organizationData,
  setName,
  displayName,
}: CustomerInstitutionInformationFromCristinProps) => {
  const { t } = useTranslation();
  const customerInformationFromCristinQuery = useQuery({
    queryKey: ['organization', cristinId, organizationData],
    enabled: !!cristinId && !organizationData,
    queryFn: () => {
      if (cristinId && !organizationData) {
        return fetchOrganization(cristinId);
      }
    },
  });

  const customerInformation = organizationData ?? customerInformationFromCristinQuery.data;
  const displayNameFromCristin = getLanguageString(organizationData?.labels, 'nb');
  if (displayName !== displayNameFromCristin && displayNameFromCristin.length > 0) {
    setName(displayNameFromCristin);
  }

  return (
    <Grid aria-live="polite" aria-busy={customerInformationFromCristinQuery.isFetching} container spacing={2}>
      {!customerInformation && customerInformationFromCristinQuery.isFetching ? (
        <Grid item xs={12}>
          <PageSpinner aria-label={t('basic_data.institutions.loading_institution_information')} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={3}>
            <TextField
              label={t('basic_data.institutions.institution_norwegian_name')}
              fullWidth
              disabled
              value={displayName ?? ''}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label={t('basic_data.institutions.institution_english_name')}
              fullWidth
              disabled
              value={customerInformation?.labels?.en ?? ''}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              disabled
              fullWidth
              value={customerInformation?.acronym ?? ''}
              variant="filled"
              label={t('basic_data.institutions.short_name')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              disabled
              fullWidth
              value={getUnitTopLevelCode(cristinId) ?? ''}
              variant="filled"
              label={t('basic_data.institutions.institution_toplevel_code')}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

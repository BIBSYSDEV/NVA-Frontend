import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../api/cristinApi';
import { PageSpinner } from '../../../components/PageSpinner';

interface CustomerInstitutionInformationFromCristinProps {
  cristinId?: string;
}

export const CustomerInstitutionInformationFromCristin = ({
  cristinId,
}: CustomerInstitutionInformationFromCristinProps) => {
  const { t } = useTranslation();
  const organizationQuery = useQuery({
    queryKey: [cristinId],
    enabled: !!cristinId,
    queryFn: cristinId ? () => fetchOrganization(cristinId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

  const customerInformation = organizationQuery.data;

  return (
    <Grid aria-live="polite" aria-busy={organizationQuery.isFetching} container spacing={2}>
      {!customerInformation && organizationQuery.isFetching ? (
        <Grid item xs={12}>
          <PageSpinner aria-label={t('basic_data.institutions.loading_institution_information')} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" component="h2">
              {t('editor.institution.institution_name_norwegian')}
            </Typography>
            <Typography>{customerInformation?.labels.nb ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" component="h2">
              {t('editor.institution.institution_name_english')}
            </Typography>
            <Typography>{customerInformation?.labels.en ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" component="h2">
              {t('editor.institution.institution_short_name')}
            </Typography>
            <Typography>{customerInformation?.acronym ?? '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" component="h2">
              {t('editor.institution.institution_code')}
            </Typography>
            <Typography>{customerInformation?.id.split('/').pop() ?? '-'}</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};

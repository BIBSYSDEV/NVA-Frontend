import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { PageSpinner } from '../../../components/PageSpinner';
import { CustomerInstitutionFieldNames, CustomerInstitutionFormData } from '../../../types/customerInstitution.types';

interface CustomerInstitutionInformationFromCristinProps {
  cristinId?: string;
}

export const CustomerInstitutionInformationFromCristin = ({
  cristinId,
}: CustomerInstitutionInformationFromCristinProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CustomerInstitutionFormData>();
  const organizationQuery = useFetchOrganization(cristinId ?? '');
  const customerInformation = organizationQuery.data;
  const nbInstitutionName = customerInformation?.labels.nb;

  useEffect(() => {
    if (
      nbInstitutionName &&
      (nbInstitutionName !== values.customer.displayName || nbInstitutionName !== values.customer.name)
    ) {
      // Ensure that customer name is up to date with name in Cristin
      setFieldValue(CustomerInstitutionFieldNames.Name, nbInstitutionName);
      setFieldValue(CustomerInstitutionFieldNames.DisplayName, nbInstitutionName);
    }
  }, [setFieldValue, nbInstitutionName, values.customer.displayName, values.customer.name]);

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
            <Typography>{nbInstitutionName ?? '-'}</Typography>
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

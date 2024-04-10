import { Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams, fetchResults } from '../../../../api/searchApi';
import { TruncatableTypography } from '../../../../components/TruncatableTypography';
import { getTitleString } from '../../../../utils/registration-helpers';

interface LastRegistrationTableCellContentPorps {
  personId: string;
}

export const LastRegistrationTableCellContent = ({ personId }: LastRegistrationTableCellContentPorps) => {
  const { t } = useTranslation();

  const registrationsQueryConfig: FetchResultsParams = {
    contributor: personId,
    results: 1,
  };
  const registrationsQuery = useQuery({
    enabled: !!personId,
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: () => fetchResults(registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const registration =
    registrationsQuery.data?.hits && registrationsQuery.data.hits.length > 0 ? registrationsQuery.data.hits[0] : null;
  const totalHits = registrationsQuery.data?.totalHits ?? 0;

  return registrationsQuery.isLoading ? (
    <Skeleton />
  ) : registration ? (
    <>
      <TruncatableTypography lines={2}>
        {getTitleString(registration.entityDescription?.mainTitle)}
      </TruncatableTypography>
      {totalHits > 1 && (
        <Typography fontStyle="italic">
          {t('registration.contributors.other_registrations', { count: totalHits - 1 })}
        </Typography>
      )}
    </>
  ) : (
    <Typography fontStyle="italic">{t('registration.contributors.no_registrations_found')}</Typography>
  );
};

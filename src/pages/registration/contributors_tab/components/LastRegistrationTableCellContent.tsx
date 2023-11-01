import { Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '../../../../api/searchApi';
import { TruncatableTypography } from '../../../../components/TruncatableTypography';
import { getTitleString } from '../../../../utils/registration-helpers';

interface LastRegistrationTableCellContentPorps {
  personId: string;
}

export const LastRegistrationTableCellContent = ({ personId }: LastRegistrationTableCellContentPorps) => {
  const { t } = useTranslation();

  const registrationsQuery = useQuery({
    enabled: !!personId,
    queryKey: ['registrations', 1, 0, personId],
    queryFn: () => fetchResults(1, 0, { contributor: personId }),
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
    <i>{t('registration.contributors.no_registrations_found')}</i>
  );
};

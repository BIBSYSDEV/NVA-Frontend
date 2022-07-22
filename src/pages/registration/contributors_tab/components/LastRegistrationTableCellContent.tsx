import { Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../../../api/apiPaths';
import { TruncatableTypography } from '../../../../components/TruncatableTypography';
import { SearchResponse } from '../../../../types/common.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { useFetch } from '../../../../utils/hooks/useFetch';

interface LastRegistrationTableCellContentPorps {
  personId: string;
}

export const LastRegistrationTableCellContent = ({ personId }: LastRegistrationTableCellContentPorps) => {
  const { t } = useTranslation('feedback');
  const [registrationSearch, isLoadingRegistrationSearch] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query=(${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}:"${personId}")&results=1`,
    errorMessage: t('error.search'),
  });
  const registration = registrationSearch && registrationSearch.size > 0 ? registrationSearch.hits[0] : null;

  return isLoadingRegistrationSearch ? (
    <Skeleton />
  ) : registration ? (
    <>
      <TruncatableTypography lines={2}>{registration.entityDescription?.mainTitle}</TruncatableTypography>
      {registrationSearch && registrationSearch.size > 1 && (
        <Typography fontStyle="italic">
          {t('registration.contributors.other_registrations', { count: registrationSearch.size - 1 })}
        </Typography>
      )}
    </>
  ) : (
    <i>{t('registration.contributors.no_registrations_found')}</i>
  );
};

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../searchApi';

export const useDuplicateRegistrationSearch = (
  title: string | undefined,
  identifier?: string,
  publishedYear?: string
) => {
  const { t } = useTranslation();

  const searchConfig: FetchResultsParams = {
    title: title,
  };

  const titleSearch = useQuery({
    enabled: !!title,
    queryKey: ['registrations', searchConfig],
    queryFn: () => fetchResults(searchConfig),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const registrationsWithSimilarName = titleSearch.data?.hits ?? [];
  const duplicateRegistration = registrationsWithSimilarName.find((reg) => {
    if (!title) {
      return false;
    }

    const isSameRegistration = reg.identifier === identifier;
    const hasSameName = reg.entityDescription?.mainTitle.toLowerCase() === title.toLowerCase();

    if (!hasSameName || isSameRegistration) {
      return false;
    }

    if (publishedYear && reg?.entityDescription?.publicationDate?.year !== publishedYear) {
      return false;
    }

    return true;
  });

  return {
    titleSearchPending: titleSearch.isPending,
    duplicateRegistration: duplicateRegistration,
  };
};

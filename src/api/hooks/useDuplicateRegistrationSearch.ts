import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../searchApi';

export const useDuplicateRegistrationSearch = (
  title: string | undefined,
  identifier?: string,
  publishedYear?: string,
  category?: string
) => {
  const { t } = useTranslation();

  const searchConfig: FetchResultsParams = {
    title: title,
  };

  const enabled = !!title;

  const titleSearch = useQuery({
    enabled: enabled,
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

    if (category && reg.entityDescription?.reference?.publicationInstance?.type !== category) {
      return false;
    }

    return true;
  });

  return {
    titleSearchPending: enabled && titleSearch.isPending,
    duplicateRegistration: duplicateRegistration,
  };
};

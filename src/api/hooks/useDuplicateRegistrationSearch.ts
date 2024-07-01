import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../searchApi';

export const useDuplicateRegistrationSearch = (title: string, publishedYear?: string, publicationContext?: string) => {
  const { t } = useTranslation();

  const searchConfig: FetchResultsParams = {
    title: title,
  };

  const titleSearch = useQuery({
    queryKey: ['registrations', searchConfig],
    queryFn: () => fetchResults(searchConfig),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const registrationsWithSimilarName = titleSearch.data?.hits ?? [];

  let registrationWithSameName = registrationsWithSimilarName.find(
    (reg) => reg.entityDescription?.mainTitle.toLowerCase() === title.toLowerCase()
  );

  if (publishedYear && registrationWithSameName?.entityDescription?.publicationDate?.year !== publishedYear) {
    registrationWithSameName = undefined;
  }

  if (
    publicationContext &&
    registrationWithSameName?.entityDescription?.reference?.publicationContext.type !== publicationContext
  ) {
    registrationWithSameName = undefined;
  }

  return {
    titleSearchPending: titleSearch.isPending,
    registrationWithSameName: registrationWithSameName,
  };
};

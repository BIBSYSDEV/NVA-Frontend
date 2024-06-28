import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../searchApi';

export const useDuplicateTitleSearch = (title: string, publishedYear?: string, publicationContext?: string) => {
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
  const registrationWithSameName = registrationsWithSimilarName.find(
    (reg) => reg.entityDescription?.mainTitle.toLowerCase() === title.toLowerCase()
  );
  let hasSamePublicationYear = false;
  let hasSamePublicationContext = false;

  if (registrationWithSameName) {
    hasSamePublicationYear =
      registrationWithSameName.entityDescription?.publicationDate?.year === publishedYear || false;

    hasSamePublicationContext =
      (publicationContext &&
        registrationWithSameName.entityDescription?.reference?.publicationContext.type === publicationContext) ||
      false;
  }

  return {
    titleSearchPending: titleSearch.isPending,
    registrationWithSameName: registrationWithSameName,
    hasSamePublicationYear: hasSamePublicationYear,
    hasSameCategory: hasSamePublicationContext,
  };
};

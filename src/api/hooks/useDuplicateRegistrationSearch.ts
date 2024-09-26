import { PublicationInstanceType } from '../../types/registration.types';
import { useRegistrationSearch } from './useRegistrationSearch';

interface UseDuplicateRegistrationSearchParams {
  enabled?: boolean;
  title?: string;
  identifier?: string;
  publishedYear?: string;
  category?: PublicationInstanceType | '';
}

export const useDuplicateRegistrationSearch = ({
  title,
  enabled = !!title,
  identifier,
  publishedYear,
  category,
}: UseDuplicateRegistrationSearchParams) => {
  const titleSearch = useRegistrationSearch({
    enabled: enabled && !!title,
    params: { title },
  });

  const registrationsWithSimilarName = titleSearch.data?.hits ?? [];
  const duplicateRegistration = !title
    ? undefined
    : registrationsWithSimilarName.find((reg) => {
        const isSameRegistration = reg.identifier === identifier;
        const hasSameName = reg.entityDescription?.mainTitle.toLowerCase() === title.toLowerCase();

        if (!hasSameName || isSameRegistration) {
          return false;
        }

        if (publishedYear && reg.entityDescription?.publicationDate?.year !== publishedYear) {
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

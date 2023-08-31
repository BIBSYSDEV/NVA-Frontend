import { PromotedPublications } from '../types/promotedPublications.types';
import { PersonPreferencesApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const fetchPromotedPublicationsById = async (identifier: string) => {
  const getPromotedPublications = await authenticatedApiRequest2<PromotedPublications>({
    url: `${PersonPreferencesApiPath.PersonPreferences}${identifier}`,
  });

  return getPromotedPublications.data;
};

export const updatePromotedPublications = async (promotedPublications: string[]) =>
  await authenticatedApiRequest2<PromotedPublications>({
    url: PersonPreferencesApiPath.PersonPreferences,
    method: 'PUT',
    data: {
      promotedPublications: promotedPublications,
    },
  });

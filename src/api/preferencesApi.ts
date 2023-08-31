import { PersonPreferences } from '../types/personPreferences.types';
import { PersonPreferencesApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const fetchPromotedPublicationsById = async (id: string) => {
  const getPromotedPublications = await authenticatedApiRequest2<PersonPreferences>({
    url: `${PersonPreferencesApiPath.PersonPreferences}/${id}`,
  });

  return getPromotedPublications.data;
};

export const updatePromotedPublications = async (promotedPublications: string[]) =>
  await authenticatedApiRequest2<PersonPreferences>({
    url: PersonPreferencesApiPath.PersonPreferences,
    method: 'PUT',
    data: {
      promotedPublications: promotedPublications,
    },
  });

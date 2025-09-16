import { PersonPreferences } from '../types/personPreferences.types';
import { PersonPreferencesApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

export const fetchPromotedPublicationsById = async (id: string) => {
  const getPromotedPublications = await apiRequest2<PersonPreferences>({
    url: `${PersonPreferencesApiPath.PersonPreferences}/${encodeURIComponent(id)}`,
  });

  return getPromotedPublications.data;
};

export const updatePromotedPublications = async (personId: string, promotedPublications: string[]) => {
  const updatePromotedPublication = await authenticatedApiRequest2<PersonPreferences>({
    url: `${PersonPreferencesApiPath.PersonPreferences}/${personId}`,
    method: 'PUT',
    data: { promotedPublications },
  });

  return updatePromotedPublication.data;
};

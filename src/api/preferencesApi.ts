import { PromotedPublications } from '../types/promotedPublications.types';
import { PromotedPublicationsApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const fetchPromotedPublicationsById = async (identifier: string) => {
  const getPromotedPublications = await authenticatedApiRequest2<PromotedPublications>({
    url: `${PromotedPublicationsApiPath.PromotedPublications}${identifier}`,
  });

  return getPromotedPublications.data;
};

export const createPromotedPublications = async (identifier: string, promotedPublication: string) =>
  await authenticatedApiRequest2<PromotedPublications>({
    url: PromotedPublicationsApiPath.PromotedPublications,
    method: 'POST',
    data: {
      identifier: identifier,
      promotedPublications: [promotedPublication],
    },
  });

export const updatePromotedPublications = async (identifier: string, promotedPublications: string[]) =>
  await authenticatedApiRequest2<PromotedPublications>({
    url: PromotedPublicationsApiPath.PromotedPublications,
    method: 'PUT',
    data: {
      identifier: identifier,
      promotedPublications: promotedPublications,
    },
  });

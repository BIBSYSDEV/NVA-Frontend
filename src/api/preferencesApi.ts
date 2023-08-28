import { PromotedPublications } from '../types/promotedPublications.types';
import { PromotedPublicationsApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const fetchPromotedPublicationsById = async (identifier: string) => {
  const getPromotedPublications = await authenticatedApiRequest2<PromotedPublications>({
    url: `${PromotedPublicationsApiPath.PromotedPublications}${identifier}`,
  });

  return getPromotedPublications.data;
};

export const createPromotedPublications = async (promotedPublication: PromotedPublications) =>
  await authenticatedApiRequest2<PromotedPublications>({
    url: PromotedPublicationsApiPath.PromotedPublications,
    method: 'POST',
    data: promotedPublication,
  });

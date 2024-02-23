import { authenticatedApiRequest2 } from './apiRequest';

export const getById = async <T>(id: string) => {
  if (!id) {
    return;
  }

  const getByIdResponse = await authenticatedApiRequest2<T>({
    url: id,
    method: 'GET',
  });

  return getByIdResponse.data;
};

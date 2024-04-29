import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';

export const getByIdAuthenticated = async <T>(id: string) => {
  if (!id) {
    return;
  }
  const getByIdResponse = await authenticatedApiRequest2<T>({
    url: id,
  });

  return getByIdResponse.data;
};

export const getById = async <T>(id: string) => {
  if (!id) {
    return;
  }
  const getByIdResponse = await apiRequest2<T>({
    url: id,
  });

  return getByIdResponse.data;
};

import axios from 'axios';

import { StatusCode, ApiBaseUrl } from '../../utils/constants';

enum AuthorityTypes {
  PERSON = 'PERSON',
}

// Authority register API docs: https://authority.bibsys.no/authority/

export const getAuthorities = async (
  query: string,
  start: number = 1,
  max: number = 10,
  type: AuthorityTypes = AuthorityTypes.PERSON
) => {
  const url = `${ApiBaseUrl.AUTHORITY_REGISTER_EXTERNAL}/functions/v2/query?q=${query}&start=${start}&max=${max}`;

  const response = await axios.get(url);

  if (response.status === StatusCode.OK) {
    const filteredAuthorities = response.data.results.filter(
      (element: { authorityType: AuthorityTypes }) => element.authorityType === type
    );
    return filteredAuthorities;
  } else {
    return [];
  }
};

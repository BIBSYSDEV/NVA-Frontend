import { Publication } from '../../types/publication.types';

export const GET_PUBLICATIONS_SUCCESS = 'get publications success';

export const getPublicationsSuccess = (publications: Publication[]): GetPublicationsSuccessAction => ({
  type: GET_PUBLICATIONS_SUCCESS,
  publications,
});

interface GetPublicationsSuccessAction {
  type: typeof GET_PUBLICATIONS_SUCCESS;
  publications: Publication[];
}

export type PublicationActions = GetPublicationsSuccessAction;

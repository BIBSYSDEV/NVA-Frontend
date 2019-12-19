import { Publication } from '../../types/publication.types';

export const GET_PUBLICATIONS_SUCCESS = 'get publications success';

// TODO: Add publicationReducer when enpoint is ready

const getPublicationsSuccess = (publications: Publication[]): GetPublicationsSuccessAction => ({
  type: GET_PUBLICATIONS_SUCCESS,
  publications,
});

interface GetPublicationsSuccessAction {
  type: typeof GET_PUBLICATIONS_SUCCESS;
  publications: Publication[];
}

type PublicationActions = GetPublicationsSuccessAction;

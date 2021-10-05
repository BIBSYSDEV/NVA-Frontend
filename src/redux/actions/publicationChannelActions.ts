import { Journal, Publisher } from '../../types/registration.types';

export const SET_PUBLICATION_CHANNEL = 'set publication channel';

export const setPublicationChannel = (publicationChannel: Journal | Publisher): SetPublicationChannelAction => ({
  type: SET_PUBLICATION_CHANNEL,
  publicationChannel,
});

interface SetPublicationChannelAction {
  type: typeof SET_PUBLICATION_CHANNEL;
  publicationChannel: Journal | Publisher;
}

export type PublicationChannelActions = SetPublicationChannelAction;

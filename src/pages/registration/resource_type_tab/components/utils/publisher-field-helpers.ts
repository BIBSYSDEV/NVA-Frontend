import { Publisher } from '../../../../../types/registration.types';

const selfPublisherType = 'SelfPublisher';

/**
 * Option in the publisher field that represents the logged-in user, as opposed to a publication channel.
 */
export interface SelfPublisher {
  type: typeof selfPublisherType;
  name: string;
  personId: string;
}

export type PublisherFieldOption = Publisher | SelfPublisher;

/**
 * Decides if the logged-in user should be offered as a publisher option for the current search query.
 * The option is offered when nothing is typed yet, and as long as the query matches part of the user's own name.
 *
 * @param query - The current text in the publisher search field.
 * @param user - The name and person identifier of the logged-in user.
 * @returns An option representing the logged-in user, or undefined if the user should not be offered.
 */
export const getSelfPublisherOption = (query: string, user: Omit<SelfPublisher, 'type'>): SelfPublisher | undefined => {
  const nameMatchesQuery = user.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  return user.name && nameMatchesQuery ? { type: selfPublisherType, ...user } : undefined;
};

/**
 * @param option - An option from the publisher field.
 * @returns true if the option represents the logged-in user.
 */
export const isSelfPublisher = (option: PublisherFieldOption): option is SelfPublisher =>
  option.type === selfPublisherType;

/**
 * @param option - An option from the publisher field.
 * @returns A unique key for the option.
 */
export const getPublisherOptionKey = (option: PublisherFieldOption) =>
  isSelfPublisher(option) ? option.type : option.identifier;

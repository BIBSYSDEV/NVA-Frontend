import { Identity } from '../../../../../types/contributor.types';
import { Publisher } from '../../../../../types/registration.types';

const personPublisherType = 'PersonPublisher';

/**
 * Option in the publisher field that represents a person, as opposed to a publication channel.
 */
export interface PersonPublisherOption {
  type: typeof personPublisherType;
  id: string;
  name: string;
}

export type PublisherFieldOption = Publisher | PersonPublisherOption;

/**
 * Decides if the logged-in user should be offered as a publisher option for the current search query.
 * The option is offered when nothing is typed yet, and as long as the query matches part of the user's own name.
 *
 * @param query - The current text in the publisher search field.
 * @param user - The name and Cristin id of the logged-in user.
 * @returns An option representing the logged-in user, or undefined if the user should not be offered.
 */
export const getSelfPublisherOption = (
  query: string,
  user: Omit<PersonPublisherOption, 'type'>
): PersonPublisherOption | undefined => {
  const nameMatchesQuery = user.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  return user.name && user.id && nameMatchesQuery ? { type: personPublisherType, ...user } : undefined;
};

/**
 * @param option - An option from the publisher field.
 * @returns true if the option represents a person.
 */
export const isPersonPublisherOption = (option: PublisherFieldOption): option is PersonPublisherOption =>
  option.type === personPublisherType;

/**
 * @param option - An option from the publisher field.
 * @returns A unique key for the option.
 */
export const getPublisherOptionKey = (option: PublisherFieldOption) =>
  isPersonPublisherOption(option) ? option.id : option.identifier;

/**
 * @param person - A person selected as publisher.
 * @returns The publisher value to store on the registration.
 */
export const createPersonPublisher = (person: PersonPublisherOption): Identity => ({
  type: 'Identity',
  id: person.id,
  name: person.name,
  nameType: 'Personal',
});

/**
 * @param publisher - A person stored as publisher on the registration.
 * @returns The option representing the person in the publisher field.
 */
export const toPersonPublisherOption = (publisher: Identity): PersonPublisherOption => ({
  type: personPublisherType,
  id: publisher.id ?? '',
  name: publisher.name,
});

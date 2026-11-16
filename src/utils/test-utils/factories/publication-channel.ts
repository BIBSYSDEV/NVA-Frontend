import { Publisher, SerialPublication } from '../../../types/registration.types';

const makeSerialPublication = (
  type: SerialPublication['type'],
  overrides: Partial<SerialPublication>
): SerialPublication => ({
  type,
  id: '',
  identifier: '',
  name: '',
  sameAs: '',
  scientificValue: 'Unassigned',
  ...overrides,
});

export const makeJournal = (overrides: Partial<SerialPublication> = {}): SerialPublication =>
  makeSerialPublication('Journal', overrides);

export const makeSeries = (overrides: Partial<SerialPublication> = {}): SerialPublication =>
  makeSerialPublication('Series', overrides);

export const makePublisher = (overrides: Partial<Publisher> = {}): Publisher => ({
  type: 'Publisher',
  id: '',
  identifier: '',
  name: '',
  sameAs: '',
  scientificValue: 'Unassigned',
  ...overrides,
});

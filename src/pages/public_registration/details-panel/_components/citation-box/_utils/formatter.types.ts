import { Registration } from '../../../../../../types/registration.types';

export interface FormatAPAOptions {
  /**
   * The journal name resolved from the publication channel (SerialPublication.name).
   * publicationContext.title is only used as a fallback for unconfirmed journals.
   */
  journalName?: string;
  /**
   * The publisher name resolved from the publication channel.
   * publicationContext.publisher.name is used as a fallback for unconfirmed publishers.
   */
  publisherName?: string;
  /**
   * For chapters: the formatted editor name(s) of the parent book.
   * Must be resolved by the caller from the parent book registration.
   */
  editors?: string;
  /**
   * For chapters: the title of the parent book.
   * Must be resolved by the caller from the parent book registration.
   */
  bookTitle?: string;
}

/**
 * Takes a registration and options, returns an APA-style citation string.
 * Each registered formatter handles one family of publication instance types.
 */
export type Formatter = (registration: Registration, options: FormatAPAOptions) => string;

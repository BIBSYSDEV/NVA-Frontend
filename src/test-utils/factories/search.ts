import { AggregationValue, SearchResponse, SearchResponse2 } from '../../types/common.types';
import { RegistrationSearchItem, RegistrationStatus } from '../../types/registration.types';

/**
 * Builds a search response. `size` defaults to the number of hits, which is what a test wants unless it is about
 * pagination — those tests uses override with the total number of matches.
 *
 * @param overrides Fields to override on the default response.
 * @returns A search response.
 */
export const makeSearchResponse = <HitType, AggregationType = undefined>(
  overrides: Partial<SearchResponse<HitType, AggregationType>> = {}
): SearchResponse<HitType, AggregationType> => {
  const hits = overrides.hits ?? [];

  return {
    processingTime: 0,
    hits,
    size: hits.length,
    ...overrides,
  };
};

/**
 * Builds a search response of the newer shape. `totalHits` defaults to the number of hits, which is what a test wants
 * unless it is about pagination — those tests uses override with the total number of matches.
 *
 * @param overrides Fields to override on the default response.
 * @returns A search response.
 */
export const makeSearchResponse2 = <HitType, AggregationType = undefined>(
  overrides: Partial<SearchResponse2<HitType, AggregationType>> = {}
): SearchResponse2<HitType, AggregationType> => {
  const hits = overrides.hits ?? [];

  return {
    hits,
    totalHits: hits.length,
    ...overrides,
  };
};

/**
 * Builds an aggregation bucket.
 *
 * @param overrides Fields to override on the default bucket. `key` is required, since a bucket has no meaning without
 * one and no default can be inferred for a caller-chosen key type.
 * @returns An aggregation bucket.
 */
export const makeAggregationValue = <KeyType = string>(
  overrides: Partial<AggregationValue<KeyType>> & Pick<AggregationValue<KeyType>, 'key'>
): AggregationValue<KeyType> => ({
  id: '',
  count: 0,
  ...overrides,
});

export const makeRegistrationSearchItem = (
  overrides: Partial<RegistrationSearchItem> = {}
): RegistrationSearchItem => ({
  id: '',
  identifier: '',
  type: '',
  recordMetadata: {
    status: RegistrationStatus.Published,
    createdDate: '',
    modifiedDate: '',
  },
  mainTitle: '',
  contributorsPreview: [],
  contributorsCount: 0,
  publishingDetails: {},
  abstract: '',
  description: '',
  ...overrides,
});

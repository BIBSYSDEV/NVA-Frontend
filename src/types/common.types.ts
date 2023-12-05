export interface LanguageString {
  [languageCode: string]: string;
}

export interface Place {
  type: 'UnconfirmedPlace';
  label: string;
  country: string;
}

export const emptyPlace: Place = {
  type: 'UnconfirmedPlace',
  label: '',
  country: '',
};

export interface UnconfirmedOrganization {
  type: 'UnconfirmedOrganization';
  name: string;
}

export interface Period {
  type: 'Period';
  from: string;
  to: string;
}

export const emptyPeriod: Period = {
  type: 'Period',
  from: '',
  to: '',
};

export interface Instant {
  type: 'Instant';
  value: string;
}

export const emptyInstant: Instant = {
  type: 'Instant',
  value: '',
};

export interface SearchResponse<HitType, AggregationType = Aggregations> {
  processingTime: number;
  size: number;
  hits: HitType[];
  aggregations?: AggregationType;
}

export type Aggregations = {
  [fieldName: string]: {
    buckets?: AggregationBucket[];
  };
};

export interface AggregationBucket {
  key: string;
  docCount: number;
}

export interface SearchResponse2<HitType, AggregationType = Aggregations>
  extends Pick<SearchResponse<HitType, AggregationType>, 'hits' | 'aggregations'> {
  totalHits: number;
}

export interface AggregationValue {
  key: string;
  id: string;
  count: number;
  labels?: LanguageString;
}

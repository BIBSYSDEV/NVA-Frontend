export interface LanguageString {
  [languageCode: string]: string;
}

export interface Place {
  type: 'UnconfirmedPlace';
  name: string;
  country: string;
}

export const emptyPlace: Place = {
  type: 'UnconfirmedPlace',
  name: '',
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

export interface SearchResponse<HitType, AggregationType = undefined> {
  processingTime: number;
  size: number;
  hits: HitType[];
  aggregations?: AggregationType;
}

export interface SearchResponse2<HitType, AggregationType = undefined>
  extends Pick<SearchResponse<HitType, AggregationType>, 'hits' | 'aggregations'> {
  totalHits: number;
}

export interface AggregationValue<KeyType = string> {
  key: KeyType;
  id: string;
  count: number;
  labels?: LanguageString;
}

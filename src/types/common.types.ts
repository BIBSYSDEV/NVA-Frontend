export interface LanguageString {
  [languageCode: string]: string;
}

export interface Place {
  type: 'UnconfirmedPlace';
  label: string;
  country: string;
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

export interface SearchResponse<T> {
  processingTime: number;
  size: number;
  hits: T[];
  aggregations?: Aggregations;
}

export type Aggregations = {
  [fieldName: string]: {
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: AggregationBucket[];
  };
};

interface AggregationBucket {
  key: string;
  doc_count: number;
}

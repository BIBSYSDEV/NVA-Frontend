export interface LanguageString {
  [key: string]: string;
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

export interface Instant {
  type: 'Instant';
  value: string;
}

export interface SearchResponse<T> {
  processingTime: number;
  size: number;
  hits: T[];
}

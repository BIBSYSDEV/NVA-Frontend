export interface Keywords {
  type: 'Keyword';
  id: string;
  identifier: string;
  labels: {
    en?: string;
    nb?: string;
  };
}

export interface KeywordsOld {
  type: string;
  label: {
    en?: string;
    nb?: string;
  };
}

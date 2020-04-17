export interface Search {
  publications: any[];
  searchTerm: string;
  offset: number;
  totalNumberOfHits: number;
}

export const emptySearch: Search = {
  publications: [],
  searchTerm: '',
  offset: 0,
  totalNumberOfHits: 0,
};

export interface DuplicateSearchFilters {
  doi: string;
  title: string;
  author: string;
  yearPublished: string;
  issn: string;
}

export interface DuplicateSearchForm {
  doi: string;
  title: string;
  author: string;
  yearPublished: string;
  issn: string;
  isDoiChecked: boolean;
  isTitleChecked: boolean;
  isAuthorChecked: boolean;
  isIssnChecked: boolean;
  isYearPublishedChecked: boolean;
}

export const emptyDuplicateSearchFilter = {
  doi: '',
  title: '',
  author: '',
  yearPublished: '',
  issn: '',
};

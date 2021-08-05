export interface PagesRange {
  type: 'Range';
  begin: string;
  end: string;
}

export interface PagesMonograph {
  type: 'MonographPages';
  pages: string;
}

export const emptyPagesMonograph: PagesMonograph = {
  type: 'MonographPages',
  pages: '',
};

export const emptyPagesRange: PagesRange = {
  type: 'Range',
  begin: '',
  end: '',
};

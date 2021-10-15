export interface PagesRange {
  type: 'Range';
  begin: string | null;
  end: string | null;
}

export interface PagesMonograph {
  type: 'MonographPages';
  pages: string | null;
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

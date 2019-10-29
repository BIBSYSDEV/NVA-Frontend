import i18next from 'i18next';

export const mapBreadcrumbName = (pathName: string) => {
  switch (pathName) {
    case 'search':
      return i18next.t('Search');
    case 'user':
      return i18next.t('My profile');
    default:
      return pathName;
  }
};

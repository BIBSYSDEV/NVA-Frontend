import i18n from '../translations/i18n';

export const getTranslatedLabelForDisplayedRows = (from: number, to: number, count: number) =>
  `${from}-${to === -1 ? count : to} ${i18n.t('common:of')} ${
    count !== -1 ? count : `${i18n.t('common:table_pagination.more_than')} ${to}`
  }`;

import { hyphenate } from 'isbn3';
import { useTranslation } from 'react-i18next';
import { PublicPageInfoEntry } from '../PublicPageInfoEntry';

export const PublicIsbnContent = ({ isbnList }: { isbnList?: string[] }) => {
  const { t } = useTranslation();

  return isbnList && isbnList.length > 0 ? (
    <PublicPageInfoEntry
      title={t('registration.resource_type.isbn')}
      content={isbnList
        .filter((isbn) => isbn)
        .map((isbn) => hyphenate(isbn))
        .join(', ')}
    />
  ) : null;
};

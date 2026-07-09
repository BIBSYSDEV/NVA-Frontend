import { useTranslation } from 'react-i18next';
import { PagesMonograph } from '../../../../types/publication_types/pages.types';
import { PublicPageInfoEntry } from '../../PublicPageInfoEntry';

export const PublicTotalPagesContent = ({ pages }: { pages: PagesMonograph | null }) => {
  const { t } = useTranslation();

  return pages?.pages ? (
    <PublicPageInfoEntry title={t('registration.resource_type.number_of_pages')} content={pages.pages} />
  ) : null;
};

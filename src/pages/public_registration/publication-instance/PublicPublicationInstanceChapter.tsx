import { useTranslation } from 'react-i18next';
import { ChapterPublicationInstance } from '../../../types/publication_types/chapterRegistration.types';
import { PublicPageInfoEntry } from '../PublicPageInfoEntry';
import { getPageInterval } from './publication-instance-helpers';

export const PublicPublicationInstanceChapter = ({
  publicationInstance,
}: {
  publicationInstance: ChapterPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { pages } = publicationInstance;
  const pagesInterval = getPageInterval(pages);

  return pagesInterval ? (
    <PublicPageInfoEntry title={t('registration.resource_type.page')} content={pagesInterval} />
  ) : null;
};

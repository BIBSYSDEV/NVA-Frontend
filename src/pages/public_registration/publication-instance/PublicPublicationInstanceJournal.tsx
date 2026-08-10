import { useTranslation } from 'react-i18next';
import { JournalPublicationInstance } from '../../../types/publication_types/journalRegistration.types';
import { PublicPageInfoEntry } from '../PublicPageInfoEntry';
import { getPageInterval } from './publication-instance-helpers';

export const PublicPublicationInstanceJournal = ({
  publicationInstance,
}: {
  publicationInstance: JournalPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { articleNumber, issue, pages, volume } = publicationInstance;
  const pagesInterval = getPageInterval(pages);

  return (
    <>
      {volume && <PublicPageInfoEntry title={t('registration.resource_type.volume')} content={volume} />}
      {issue && <PublicPageInfoEntry title={t('registration.resource_type.issue')} content={issue} />}
      {pagesInterval && <PublicPageInfoEntry title={t('registration.resource_type.page')} content={pagesInterval} />}
      {articleNumber && (
        <PublicPageInfoEntry title={t('registration.resource_type.article_number')} content={articleNumber} />
      )}
    </>
  );
};

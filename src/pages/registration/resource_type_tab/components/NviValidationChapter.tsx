import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { useGetBookInformation } from '../../../../utils/nviHelpers';
import { InfoBanner } from '../../../../components/InfoBanner';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useTranslation } from 'react-i18next';
import { NviStatus } from './NviStatus';

export const NviValidationChapter = ({ registration }: { registration: ChapterRegistration }) => {
  const { t } = useTranslation();
  const bookId = registration.entityDescription.reference?.publicationContext.id ?? '';
  const { bookHasIsbn, isMonographBook, isNonFictionBook, publisherScientificValue, seriesScientificValue } =
    useGetBookInformation(bookId);
  const hasPublisherInfoAndIsbn = publisherScientificValue && bookHasIsbn;
  const seriesHasScientificValue = seriesScientificValue && seriesScientificValue !== 'Unassigned';

  if (!bookId) {
    return null;
  }

  if (hasPublisherInfoAndIsbn) {
    if (isMonographBook) {
      return (
        <InfoBanner
          type="warning"
          text={t('registration.resource_type.nvi.only_the_linked_academic_monograph_will_be_included_in_the_nvi')}
          data-testid={dataTestId.registrationWizard.resourceType.onlyLinkedMonographNviApplicable}
        />
      );
    } else {
      return (
        <>
          <NviStatus scientificValue={seriesHasScientificValue ? seriesScientificValue : publisherScientificValue} />
          {isNonFictionBook && (
            <InfoBanner
              type="warning"
              text={t('registration.resource_type.nvi.make_sure_publication_linked_to_the_correct_book_category')}
              data-testid={dataTestId.registrationWizard.resourceType.makeSureCorrectBookCategory}
            />
          )}
        </>
      );
    }
  }

  return (
    <InfoBanner
      text={t('registration.resource_type.nvi.not_applicable_isbn')}
      data-testid={dataTestId.registrationWizard.resourceType.nviFailed}
    />
  );
};

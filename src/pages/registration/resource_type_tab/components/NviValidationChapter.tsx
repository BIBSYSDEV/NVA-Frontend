import { useTranslation } from 'react-i18next';
import { InfoBannerType } from '../../../../components/info-banner/enums';
import { InfoBanner } from '../../../../components/info-banner/InfoBanner';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useGetBookInformation } from '../../../../utils/nviHelpers';
import { NviStatus } from './NviStatus';

export const NviValidationChapter = ({ registration }: { registration: ChapterRegistration }) => {
  const { t } = useTranslation();
  const bookId = registration.entityDescription.reference?.publicationContext.id ?? '';
  const {
    isBookInformationReady,
    bookHasIsbn,
    isMonographBook,
    isNonFictionBook,
    publisherScientificValue,
    seriesScientificValue,
  } = useGetBookInformation(bookId);
  const seriesHasScientificValue = seriesScientificValue && seriesScientificValue !== 'Unassigned';

  if (!bookId || !isBookInformationReady) {
    return null;
  }

  if (!bookHasIsbn) {
    return (
      <InfoBanner
        text={t('registration.resource_type.nvi.not_applicable_isbn')}
        data-testid={dataTestId.registrationWizard.resourceType.nviFailed}
      />
    );
  }

  if (isMonographBook) {
    return (
      <InfoBanner
        type={InfoBannerType.WARNING}
        text={t('registration.resource_type.nvi.only_the_linked_academic_monograph_will_be_included_in_the_nvi')}
        data-testid={dataTestId.registrationWizard.resourceType.onlyLinkedMonographNviApplicable}
      />
    );
  }

  return (
    <>
      <NviStatus scientificValue={seriesHasScientificValue ? seriesScientificValue : publisherScientificValue} />
      {isNonFictionBook && (
        <InfoBanner
          type={InfoBannerType.WARNING}
          text={t('registration.resource_type.nvi.make_sure_publication_linked_to_the_correct_book_category')}
          data-testid={dataTestId.registrationWizard.resourceType.makeSureCorrectBookCategory}
        />
      )}
    </>
  );
};

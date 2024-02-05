import { useFormikContext } from 'formik';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { RevisionField } from '../components/RevisionField';

export const BookForm = () => {
  const { values } = useFormikContext<BookRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type ?? '';

  return (
    <>
      <PublisherField />

      <NpiDisciplineField />

      <IsbnAndPages />
      <RevisionField />

      <SeriesFields />

      {nviApplicableTypes.includes(instanceType) ? <NviValidation registration={values} /> : null}
    </>
  );
};

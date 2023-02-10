import { useFormikContext } from 'formik';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SeriesFields } from '../components/SeriesFields';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';

export const BookForm = () => {
  const { values } = useFormikContext<BookRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type ?? '';

  return (
    <>
      <PublisherField />

      <NpiDisciplineField />

      <IsbnAndPages />

      <SeriesFields />

      {nviApplicableTypes.includes(instanceType) ? <NviValidation registration={values} /> : null}
    </>
  );
};

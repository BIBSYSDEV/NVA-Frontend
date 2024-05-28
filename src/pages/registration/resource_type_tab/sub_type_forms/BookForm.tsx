import { useFormikContext } from 'formik';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { PublicationInstanceType } from '../../../../types/registration.types';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { PublisherField } from '../components/PublisherField';
import { RevisionField } from '../components/RevisionField';
import { SeriesFields } from '../components/SeriesFields';

export const BookForm = () => {
  const { values } = useFormikContext<BookRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;
  const isNviApplicable = nviApplicableTypes.includes(instanceType as PublicationInstanceType);

  return (
    <>
      <PublisherField />

      <NpiDisciplineField required={isNviApplicable} />

      <IsbnAndPages />
      <RevisionField />

      <SeriesFields />

      {instanceType && isNviApplicable ? <NviValidation registration={values} /> : null}
    </>
  );
};

import { useFormikContext } from 'formik';
import { BookType } from '../../../../types/publicationFieldNames';
import { DoiField } from '../components/DoiField';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SeriesFields } from '../components/SeriesFields';
import { NviFields } from '../components/nvi_fields/NviFields';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { BookMonographContentType } from '../../../../types/publication_types/content.types';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

export const BookForm = () => {
  const { values } = useFormikContext<BookRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <DoiField />
      <PublisherField />

      <NpiDisciplineField />

      <IsbnAndPages />

      {instanceType === BookType.Monograph && <NviFields contentTypes={Object.values(BookMonographContentType)} />}

      <SeriesFields />

      {instanceType === BookType.Monograph && <NviValidation registration={values} />}
    </>
  );
};

import { useFormikContext } from 'formik';
import { BookType } from '../../../../types/publicationFieldNames';
import { NpiDisciplineField } from '../components/NpiDisciplineField';
import { NviValidation } from '../components/NviValidation';
import { SeriesFields } from '../components/SeriesFields';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { BookMonographContentType } from '../../../../types/publication_types/content.types';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { ContentTypeField } from '../components/ContentTypeField';

export const BookForm = () => {
  const { values } = useFormikContext<BookRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <PublisherField />

      <NpiDisciplineField />

      <IsbnAndPages />

      {instanceType === BookType.Monograph && (
        <ContentTypeField contentTypes={Object.values(BookMonographContentType)} />
      )}

      <SeriesFields />

      {instanceType === BookType.Monograph && <NviValidation registration={values} />}
    </>
  );
};

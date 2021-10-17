import { useFormikContext } from 'formik';
import {
  BookMonographContentType,
  ChapterContentType,
  JournalArticleContentType,
  nviApplicableContentTypes,
} from '../../../../../types/publication_types/content.types';
import { Registration } from '../../../../../types/registration.types';
import { ContentTypeField } from './ContentTypeField';
import { PeerReviewedField } from './PeerReviewedField';

interface NviFieldsProps {
  contentTypes: JournalArticleContentType[] | BookMonographContentType[] | ChapterContentType[];
}

export const NviFields = ({ contentTypes }: NviFieldsProps) => {
  const {
    values: { entityDescription },
  } = useFormikContext<Registration>();
  const contentType =
    entityDescription?.reference.publicationInstance && 'contentType' in entityDescription.reference.publicationInstance
      ? entityDescription.reference.publicationInstance.contentType ?? ''
      : '';

  return (
    <>
      <ContentTypeField contentTypes={contentTypes} />
      {nviApplicableContentTypes.includes(contentType) && <PeerReviewedField />}
    </>
  );
};

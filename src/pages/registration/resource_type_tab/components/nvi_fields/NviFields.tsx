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
    values: {
      entityDescription: {
        reference: { publicationInstance },
      },
    },
  } = useFormikContext<Registration>();
  const contentType = 'contentType' in publicationInstance ? (publicationInstance.contentType as string) : '';

  return (
    <>
      <ContentTypeField contentTypes={contentTypes} />
      {nviApplicableContentTypes.includes(contentType) && <PeerReviewedField />}
    </>
  );
};

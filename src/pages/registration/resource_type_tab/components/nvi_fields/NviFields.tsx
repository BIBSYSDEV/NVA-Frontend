import {
  BookMonographContentType,
  ChapterContentType,
  JournalArticleContentType,
} from '../../../../../types/publication_types/content.types';
import { ContentTypeField } from './ContentTypeField';

interface NviFieldsProps {
  contentTypes: JournalArticleContentType[] | BookMonographContentType[] | ChapterContentType[];
}

export const NviFields = ({ contentTypes }: NviFieldsProps) => {
  return <ContentTypeField contentTypes={contentTypes} />;
};

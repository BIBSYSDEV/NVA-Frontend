import { useFormikContext } from 'formik';
import styled from 'styled-components';
import {
  BookMonographContentType,
  ChapterContentType,
  JournalArticleContentType,
  nviApplicableContentTypes,
} from '../../../../../types/publication_types/content.types';
import { Registration } from '../../../../../types/registration.types';
import { ContentTypeField } from './ContentTypeField';
import { OriginalResearchField } from './OriginalResearchField';
import { PeerReviewedField } from './PeerReviewedField';

const StyledRadioGroup = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
  }

  // Style label/heading for Radio Group
  legend {
    font-size: 1.25rem;
    font-weight: 700;
  }
`;

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
      {nviApplicableContentTypes.includes(contentType) && (
        <StyledRadioGroup>
          <PeerReviewedField />
          <OriginalResearchField />
        </StyledRadioGroup>
      )}
    </>
  );
};

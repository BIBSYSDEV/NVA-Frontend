import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { ContentTypeOption, nviApplicableContentTypes } from '../../../../../types/publication_types/content.types';
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
  contentTypeOptions: ContentTypeOption[];
}

export const NviFields = ({ contentTypeOptions }: NviFieldsProps) => {
  const { values } = useFormikContext<Registration>();
  const { publicationInstance } = values.entityDescription.reference;
  const contentType = 'contentType' in publicationInstance ? publicationInstance.contentType : '';

  return (
    <>
      <ContentTypeField options={contentTypeOptions} />
      {nviApplicableContentTypes.includes(contentType as string) && (
        <StyledRadioGroup>
          <PeerReviewedField />
          <OriginalResearchField />
        </StyledRadioGroup>
      )}
    </>
  );
};

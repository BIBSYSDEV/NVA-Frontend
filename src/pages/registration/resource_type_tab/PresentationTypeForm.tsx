import { useFormikContext } from 'formik';
import React from 'react';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { lightTheme } from '../../../themes/lightTheme';
import { PresentationType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { PresentationRegistration } from '../../../types/publication_types/presentationRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';

interface PresentationTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const JournalTypeForm = ({ onChangeSubType }: PresentationTypeFormProps) => {
  const { values } = useFormikContext<PresentationRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(PresentationType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && <h1>{subType}</h1>}
    </>
  );
};

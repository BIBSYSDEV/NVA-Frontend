import { useFormikContext } from 'formik';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { ResourceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import { ReportRegistration } from '../../../types/publication_types/reportRegistration.types';
import { SelectTypeField } from './components/SelectTypeField';
import { RegistrationTypeFormProps } from './JournalTypeForm';
import { ReportForm } from './sub_type_forms/ReportForm';

export const ReportTypeForm = ({ onChangeSubType }: RegistrationTypeFormProps) => {
  const { values } = useFormikContext<ReportRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <StyledSelectWrapper>
        <SelectTypeField
          fieldName={ResourceFieldNames.SubType}
          onChangeType={onChangeSubType}
          options={Object.values(ReportType)}
        />
      </StyledSelectWrapper>

      {subType && <ReportForm />}
    </>
  );
};

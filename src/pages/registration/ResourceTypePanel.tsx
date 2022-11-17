import { ErrorMessage, useFormikContext } from 'formik';
import { FormHelperText } from '@mui/material';
import { InputContainerBox } from '../../components/styled/Wrappers';
import { PublicationType, ResourceFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { BookTypeForm } from './resource_type_tab/BookTypeForm';
import { ChapterTypeForm } from './resource_type_tab/ChapterTypeForm';
import { DegreeTypeForm } from './resource_type_tab/DegreeTypeForm';
import { JournalTypeForm } from './resource_type_tab/JournalTypeForm';
import { ReportTypeForm } from './resource_type_tab/ReportTypeForm';
import { getMainRegistrationType } from '../../utils/registration-helpers';
import { PresentationTypeForm } from './resource_type_tab/PresentationTypeForm';
import { ArtisticTypeForm } from './resource_type_tab/ArtisticTypeForm';
import { ResearchDataTypeForm } from './resource_type_tab/ResearchDataTypeForm';
import { MediaTypeForm } from './resource_type_tab/sub_type_forms/media_types/MediaTypeForm';
import { OtherTypeForm } from './resource_type_tab/OtherTypeForm';
import { SelectRegistrationTypeField } from './resource_type_tab/SelectRegistrationTypeField';

export const ResourceTypePanel = () => {
  const { values } = useFormikContext<Registration>();
  const instanceType = values.entityDescription?.reference?.publicationInstance.type ?? '';
  const mainType = getMainRegistrationType(instanceType);

  return (
    <InputContainerBox>
      <SelectRegistrationTypeField />
      <FormHelperText error>
        <ErrorMessage name={ResourceFieldNames.SubType} />
      </FormHelperText>

      {mainType === PublicationType.PublicationInJournal ? (
        <JournalTypeForm />
      ) : mainType === PublicationType.Book ? (
        <BookTypeForm />
      ) : mainType === PublicationType.Report ? (
        <ReportTypeForm />
      ) : mainType === PublicationType.Degree ? (
        <DegreeTypeForm />
      ) : mainType === PublicationType.Chapter ? (
        <ChapterTypeForm />
      ) : mainType === PublicationType.Presentation ? (
        <PresentationTypeForm />
      ) : mainType === PublicationType.Artistic ? (
        <ArtisticTypeForm />
      ) : mainType === PublicationType.MediaContribution ? (
        <MediaTypeForm />
      ) : mainType === PublicationType.ResearchData ? (
        <ResearchDataTypeForm />
      ) : mainType === PublicationType.GeographicalContent ? (
        <OtherTypeForm />
      ) : null}
    </InputContainerBox>
  );
};

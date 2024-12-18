import { TextField } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { DegreeType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { TotalPagesField } from '../components/isbn_and_pages/TotalPagesField';
import { PhdForm } from './degree_types/PhdForm';

interface DegreeFormProps {
  subType: string;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => {
  const { t } = useTranslation();

  if (subType === DegreeType.Phd || subType === DegreeType.ArtisticPhd) {
    return <PhdForm subType={subType} />;
  }

  return (
    <>
      <PublisherField />

      {(subType === DegreeType.Bachelor || subType === DegreeType.Master || subType === DegreeType.Other) && (
        <Field name={ResourceFieldNames.PublicationContextCourseCode}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              data-testid={dataTestId.registrationWizard.resourceType.courseCodeField}
              variant="filled"
              sx={{ width: 'fit-content' }}
              label={t('registration.resource_type.course_code')}
              value={field.value ?? ''}
              slotProps={{ htmlInput: { maxLength: 15 } }}
            />
          )}
        </Field>
      )}

      {subType === DegreeType.Bachelor || subType === DegreeType.Master ? <TotalPagesField /> : <IsbnAndPages />}
      {subType === DegreeType.Licentiate && <SeriesFields />}
    </>
  );
};

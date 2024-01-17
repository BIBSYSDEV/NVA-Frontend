import { TextField, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { DegreeType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import { PublisherField } from '../components/PublisherField';
import { SearchRelatedResultField } from '../components/SearchRelatedResultField';
import { SeriesFields } from '../components/SeriesFields';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { TotalPagesField } from '../components/isbn_and_pages/TotalPagesField';

interface DegreeFormProps {
  subType: string;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => {
  const { t } = useTranslation();

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
              inputProps={{ maxLength: 15 }}
              label={t('registration.resource_type.course_code')}
              value={field.value ?? ''}
            />
          )}
        </Field>
      )}

      {subType === DegreeType.Bachelor || subType === DegreeType.Master ? <TotalPagesField /> : <IsbnAndPages />}
      {(subType === DegreeType.Phd || subType === DegreeType.Licentiate) && <SeriesFields />}
      {subType === DegreeType.Phd && (
        <>
          <Typography variant="h2">{t('registration.resource_type.related_result')}</Typography>
          <SearchRelatedResultField />
        </>
      )}
    </>
  );
};

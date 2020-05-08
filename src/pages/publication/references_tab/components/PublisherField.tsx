import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage, FormikProps, useFormikContext } from 'formik';
import PublicationChannelSearch from './PublicationChannelSearch';
import { PublicationTableNumber } from '../../../../utils/constants';
import PublisherRow from './PublisherRow';
import { Publisher, levelMap, FormikPublication } from '../../../../types/publication.types';
import { PublicationType } from '../../../../types/publicationFieldNames';

interface PublisherFieldProps {
  fieldName: string;
  publicationTable?: PublicationTableNumber;
  label: string;
  placeholder: string;
}

const PublisherField: FC<PublisherFieldProps> = ({
  fieldName,
  publicationTable = PublicationTableNumber.PUBLISHERS,
  label,
  placeholder,
}) => {
  const { touched }: FormikProps<FormikPublication> = useFormikContext();

  const mapPublisher = (selectedPublisher: Publisher, type: PublicationType) => {
    const levelAsEnum = Object.keys(levelMap).find((key) => levelMap[key] === selectedPublisher.level);
    return { ...selectedPublisher, level: levelAsEnum, type }; //TODO: remove type when this is implemented as part of channel register (NP-774)
  };

  return (
    <Field name={fieldName}>
      {({ field: { name, value }, form: { setFieldValue }, meta: { error } }: FieldProps) => (
        <>
          <PublicationChannelSearch
            clearSearchField={value === null}
            dataTestId="autosearch-publisher"
            label={label}
            publicationTable={publicationTable}
            setValueFunction={(selectedPublisher) => setFieldValue(name, mapPublisher(selectedPublisher, value.type))}
            placeholder={placeholder}
            errorMessage={
              error && touched.entityDescription?.reference?.publicationContext?.title ? (
                // Must use global touched variable instead of what is in meta, since meta.touched always will
                // evaluate to true if it is a object (as in this case). Even though this field will update
                // the whole object, we only want to show error message if we are missing the title property.
                <ErrorMessage name={`${fieldName}.title`} />
              ) : (
                ''
              )
            }
          />

          {value.title && (
            <PublisherRow
              dataTestId="autosearch-results-publisher"
              publisher={value}
              label={label}
              onClickDelete={() =>
                setFieldValue(name, {
                  type: value.type, // Remove everything except the type
                })
              }
            />
          )}
        </>
      )}
    </Field>
  );
};

export default PublisherField;

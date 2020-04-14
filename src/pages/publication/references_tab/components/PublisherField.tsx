import React, { FC } from 'react';
import { Field, FieldProps } from 'formik';
import PublicationChannelSearch from './PublicationChannelSearch';
import { emptyPublisher } from '../../../../types/publication.types';
import { PublicationTableNumber } from '../../../../utils/constants';
import PublisherRow from './PublisherRow';

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
  return (
    <>
      <Field name={fieldName}>
        {({ field: { name, value }, form: { setFieldValue }, meta: { error, touched } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-publisher"
              label={label}
              publicationTable={publicationTable}
              setValueFunction={
                (inputValue) => setFieldValue(name, { ...inputValue, type: 'PublicationContext' } ?? emptyPublisher) //TODO: remove type when fixed in backend
              }
              placeholder={placeholder}
              errorMessage={touched && !value ? error : ''}
            />
            {value && (
              <PublisherRow
                dataTestId="autosearch-results-publisher"
                publisher={value}
                label={label}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default PublisherField;

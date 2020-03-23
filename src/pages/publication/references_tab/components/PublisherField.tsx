import React, { FC } from 'react';
import { Field, FieldProps } from 'formik';
import PublicationChannelSearch from './PublicationChannelSearch';
import { emptyPublisher } from '../../../../types/references.types';
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
    <Field name={fieldName}>
      {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
        <>
          <PublicationChannelSearch
            clearSearchField={value === emptyPublisher}
            dataTestId="autosearch-journal"
            label={label}
            publicationTable={publicationTable}
            setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
            placeholder={placeholder}
          />
          {value.title && (
            <PublisherRow
              dataTestId="autosearch-results-journal"
              publisher={value}
              label={label}
              onClickDelete={() => setFieldValue(name, emptyPublisher)}
            />
          )}
        </>
      )}
    </Field>
    // TODO: Error message
  );
};

export default PublisherField;

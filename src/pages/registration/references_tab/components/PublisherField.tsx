import React, { FC } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import PublicationChannelSearch from './PublicationChannelSearch';
import { PublicationTableNumber } from '../../../../utils/constants';
import PublisherRow from './PublisherRow';
import { contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { levelMap } from '../../../../types/registration.types';

interface PublisherFieldProps {
  publicationTable?: PublicationTableNumber;
  label: string;
  placeholder: string;
  touched: boolean | undefined;
  errorName: string;
}

const PublisherField: FC<PublisherFieldProps> = ({
  publicationTable = PublicationTableNumber.PUBLISHERS,
  label,
  placeholder,
  touched,
  errorName,
}) => {
  return (
    <Field name={contextTypeBaseFieldName}>
      {({ field: { name, value }, form: { setFieldValue }, meta: { error } }: FieldProps) => (
        <>
          <PublicationChannelSearch
            clearSearchField
            dataTestId="autosearch-publisher"
            label={label}
            publicationTable={publicationTable}
            setValueFunction={(inputValue) => {
              setFieldValue(name, {
                ...value,
                title: inputValue.title,
                publisher: inputValue.title,
                level: Object.keys(levelMap).find((key) => levelMap[key] === inputValue.level),
                url: inputValue.url,
              });
            }}
            placeholder={placeholder}
            errorMessage={error && touched ? <ErrorMessage name={errorName} /> : ''}
          />

          {(value.title || value.publisher) && (
            <PublisherRow
              dataTestId="autosearch-results-publisher"
              publisher={value.title ? value : { ...value, title: value.publisher }}
              label={label}
              data-testid="delete-publisher"
              onClickDelete={() => {
                setFieldValue(name, { ...value, publisher: '', title: '', level: '', url: '' });
              }}
            />
          )}
        </>
      )}
    </Field>
  );
};

export default PublisherField;

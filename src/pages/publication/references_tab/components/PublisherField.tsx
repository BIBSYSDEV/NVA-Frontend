import React, { FC } from 'react';
import { Field, FieldProps } from 'formik';
import PublicationChannelSearch from './PublicationChannelSearch';
import { PublicationTableNumber } from '../../../../utils/constants';
import PublisherRow from './PublisherRow';
import { Publisher, levelMap } from '../../../../types/publication.types';
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
  const mapPublisher = (selectedPublisher: Publisher, type: PublicationType) => {
    const levelAsEnum = Object.keys(levelMap).find((key) => levelMap[key] === selectedPublisher.level);
    return { ...selectedPublisher, level: levelAsEnum, type }; //TODO: remove type when this is implemented as part of channel register (NP-774)
  };

  return (
    <Field name={fieldName}>
      {({ field: { name, value }, form: { setFieldValue }, meta: { error, touched } }: FieldProps) => (
        <>
          <PublicationChannelSearch
            clearSearchField={value === null}
            dataTestId="autosearch-publisher"
            label={label}
            publicationTable={publicationTable}
            setValueFunction={(selectedPublisher) => setFieldValue(name, mapPublisher(selectedPublisher, value.type))}
            placeholder={placeholder}
            errorMessage={
              touched && error
                ? typeof error === 'object'
                  ? (Object.values(error)[0] as string) // Use first message if error is an object
                  : error
                : ''
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

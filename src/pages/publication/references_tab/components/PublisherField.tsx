import React, { FC } from 'react';
import { Field, FieldProps } from 'formik';
import PublicationChannelSearch from './PublicationChannelSearch';
import { PublicationTableNumber } from '../../../../utils/constants';
import PublisherRow from './PublisherRow';
import { Publisher, levelMap } from '../../../../types/publication.types';

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
  const mapPublisher = (selectedPublisher: Publisher) => {
    const levelAsEnum = Object.keys(levelMap).find((key) => levelMap[key] === selectedPublisher.level);
    return { ...selectedPublisher, level: levelAsEnum, type: 'PublicationContext' }; //TODO: remove type when fixed in backend
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
            setValueFunction={(selectedPublisher) => setFieldValue(name, mapPublisher(selectedPublisher))}
            placeholder={placeholder}
            errorMessage={touched ? error : ''}
          />
          {value && (
            <PublisherRow
              dataTestId="autosearch-results-publisher"
              publisher={value}
              label={label}
              onClickDelete={() => setFieldValue(name, null)}
            />
          )}
        </>
      )}
    </Field>
  );
};

export default PublisherField;

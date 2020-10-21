import React, { FC, useCallback, useState } from 'react';
import { Field, FieldProps, ErrorMessage, getIn, useFormikContext } from 'formik';
import { PublicationTableNumber } from '../../../../utils/constants';
import { contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { levelMap, Publisher, Publication } from '../../../../types/publication.types';
import { debounce } from '@material-ui/core';
import { getPublishers } from '../../../../api/publicationChannelApi';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import { AutocompleteTextField } from '../../description_tab/projects_field/AutocompleteTextField';

interface PublisherFieldProps {
  publicationTable?: PublicationTableNumber;
  label: string;
  placeholder: string;
  touched: boolean | undefined;
  errorName: string;
}

const PublisherField: FC<PublisherFieldProps> = ({
  publicationTable = PublicationTableNumber.PUBLISHERS,
  placeholder,
  errorName,
  label,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const { setFieldValue, setFieldTouched, errors, touched } = useFormikContext<Publication>();
  const [options, setOptions] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm) {
        setIsLoading(true);
        const response = await getPublishers(searchTerm, publicationTable);
        if (response?.error) {
          setOptions([]);
          dispatch(setNotification(t('error.search', NotificationVariant.Error)));
        } else if (response?.data) {
          setOptions(response.data.results);
        }
      } else {
        setOptions([]);
      }
      setIsLoading(false);
    }),
    [dispatch, t, publicationTable]
  );

  return (
    <Field name={contextTypeBaseFieldName}>
      {({ field: { name, value } }: FieldProps) => (
        <Autocomplete
          options={options}
          onBlur={() => setFieldTouched(errorName)}
          onInputChange={(_, newInputValue) => {
            search(newInputValue);
          }}
          value={value}
          onChange={(_, inputValue) => {
            const newValue = inputValue
              ? {
                  ...inputValue,
                  type: value.type,
                  level: Object.keys(levelMap).find((key) => levelMap[key] === inputValue?.level),
                }
              : {
                  type: value.type,
                };
            setFieldValue(name, newValue);
          }}
          loading={isLoading}
          getOptionLabel={(option) => option.title ?? ''}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={label}
              isLoading={isLoading}
              placeholder={placeholder}
              dataTestId={'publisher-search-input'}
              showSearchIcon
              errorMessage={
                !!getIn(errors, errorName) && getIn(touched, errorName) ? <ErrorMessage name={errorName} /> : null
              }
            />
          )}
        />
      )}
    </Field>
  );
};

export default PublisherField;

import React, { FC, useCallback, useState } from 'react';
import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import { PublicationTableNumber } from '../../../../utils/constants';
import { contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import { levelMap, Publisher, Publication } from '../../../../types/publication.types';
import { debounce, Typography } from '@material-ui/core';
import { getPublishers } from '../../../../api/publicationChannelApi';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { NotificationVariant } from '../../../../types/notification.types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import { AutocompleteTextField } from '../../description_tab/projects_field/AutocompleteTextField';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { getTextParts } from '../../description_tab/projects_field';

interface PublisherFieldProps {
  publicationTable?: PublicationTableNumber;
  label: string;
  placeholder: string;
  errorFieldName: string;
}

const PublisherField: FC<PublisherFieldProps> = ({
  publicationTable = PublicationTableNumber.PUBLISHERS,
  placeholder,
  errorFieldName,
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
          onBlur={() => setFieldTouched(errorFieldName)}
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
          renderOption={(option, state) => {
            const searchTerm = state.inputValue.toLocaleLowerCase();
            const parts = getTextParts(option.title, searchTerm);
            return (
              <StyledFlexColumn>
                <Typography variant="subtitle1">
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.toLocaleLowerCase() === searchTerm ? 700 : 400,
                      }}>
                      {part}
                    </span>
                  ))}
                </Typography>
                <Typography variant="body2">
                  Nivå: {option.level} - issn: {option.onlineIssn}
                </Typography>
              </StyledFlexColumn>
            );
          }}
          renderInput={(params) => (
            <AutocompleteTextField
              {...params}
              label={label}
              isLoading={isLoading}
              placeholder={placeholder}
              dataTestId={'publisher-search-input'}
              showSearchIcon
              errorMessage={getIn(touched, errorFieldName) && getIn(errors, errorFieldName)}
            />
          )}
        />
      )}
    </Field>
  );
};

export default PublisherField;

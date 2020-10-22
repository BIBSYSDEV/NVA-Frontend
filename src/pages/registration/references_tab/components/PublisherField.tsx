import React, { FC, useCallback, useState } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import { PublicationTableNumber } from '../../../../utils/constants';
import { getPublishers } from '../../../../api/publicationChannelApi';
import { AutocompleteTextField } from '../../description_tab/projects_field/AutocompleteTextField';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { getTextParts } from '../../description_tab/projects_field';
import { Registration, Publisher } from '../../../../types/registration.types';
import { debounce } from '../../../../utils/debounce';

interface PublisherFieldProps {
  publicationTable?: PublicationTableNumber;
  label: string;
  placeholder: string;
  errorFieldName: string;
  setValue?: (value?: Publisher) => void;
  value?: Publisher;
}

const PublisherField: FC<PublisherFieldProps> = ({
  publicationTable = PublicationTableNumber.PUBLISHERS,
  placeholder,
  errorFieldName,
  label,
  setValue,
  value,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const { setFieldTouched, errors, touched } = useFormikContext<Registration>();
  const [options, setOptions] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm) {
        setIsLoading(true);
        const response = await getPublishers(searchTerm, publicationTable);
        if (response?.error) {
          setOptions([]);
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
    <Autocomplete
      options={options}
      onBlur={() => setFieldTouched(errorFieldName)}
      onInputChange={(_, newInputValue) => {
        search(newInputValue);
      }}
      value={value}
      onChange={(_, inputValue) => {
        setValue?.(inputValue as Publisher);
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
  );
};

export default PublisherField;

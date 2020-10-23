import React, { FC, useCallback } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PublicationTableNumber } from '../../../../utils/constants';
import { AutocompleteTextField } from '../../description_tab/projects_field/AutocompleteTextField';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { getTextParts } from '../../description_tab/projects_field';
import { Registration, Publisher } from '../../../../types/registration.types';
import { debounce } from '../../../../utils/debounce';
import useFetchPublishers from '../../../../utils/hooks/useFetchPublishers';

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
  const { setFieldTouched, errors, touched } = useFormikContext<Registration>();
  const [publishers, isLoadingPublishers, handleNewSearchTerm] = useFetchPublishers(publicationTable);

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      handleNewSearchTerm(searchTerm);
    }),
    []
  );

  return (
    <Autocomplete
      options={publishers}
      onBlur={() => setFieldTouched(errorFieldName)}
      onInputChange={(_, newInputValue) => {
        search(newInputValue);
      }}
      value={value}
      onChange={(_, inputValue) => {
        setValue?.(inputValue as Publisher);
      }}
      loading={isLoadingPublishers}
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
          isLoading={isLoadingPublishers}
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

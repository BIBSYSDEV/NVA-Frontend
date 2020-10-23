import React, { FC } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PublicationTableNumber } from '../../../../utils/constants';
import { AutocompleteTextField } from '../../description_tab/projects_field/AutocompleteTextField';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { Registration, Publisher } from '../../../../types/registration.types';
import useFetchPublishers from '../../../../utils/hooks/useFetchPublishers';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';

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

  return (
    <Autocomplete
      options={publishers}
      onBlur={() => setFieldTouched(errorFieldName)}
      onInputChange={(_, newInputValue) => handleNewSearchTerm(newInputValue)}
      value={value}
      onChange={(_, inputValue) => {
        setValue?.(inputValue as Publisher);
      }}
      loading={isLoadingPublishers}
      getOptionLabel={(option) => option.title ?? ''}
      renderOption={(option, state) => (
        <StyledFlexColumn>
          <Typography variant="subtitle1">
            <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
          </Typography>
          <Typography variant="body2">
            Nivå: {option.level} - issn: {option.onlineIssn}
          </Typography>
        </StyledFlexColumn>
      )}
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

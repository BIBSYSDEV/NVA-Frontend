import React, { FC } from 'react';
import { getIn, useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { PublicationTableNumber } from '../../../../utils/constants';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { Registration, Publisher } from '../../../../types/registration.types';
import useFetchPublishers from '../../../../utils/hooks/useFetchPublishers';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { autocompleteTranslationProps } from '../../../../themes/mainTheme';

interface PublicationChannelSearchProps {
  publicationTable: PublicationTableNumber;
  label: string;
  placeholder: string;
  errorFieldName: string;
  setValue: (value?: Publisher) => void;
  value: Publisher;
}

const PublicationChannelSearch: FC<PublicationChannelSearchProps> = ({
  publicationTable,
  placeholder,
  errorFieldName,
  label,
  setValue,
  value,
}) => {
  const { t } = useTranslation('registration');
  const { setFieldTouched, errors, touched } = useFormikContext<Registration>();
  const [publishers, isLoadingPublishers, handleNewSearchTerm] = useFetchPublishers(publicationTable);

  return (
    <Autocomplete
      {...autocompleteTranslationProps}
      openOnFocus={false}
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
          <Typography variant="body2" color="textSecondary">
            {t('references.level')}: {option.level}
          </Typography>
        </StyledFlexColumn>
      )}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          label={label}
          isLoading={isLoadingPublishers}
          placeholder={placeholder}
          dataTestId="publisher-search-input"
          showSearchIcon
          errorMessage={getIn(touched, errorFieldName) && getIn(errors, errorFieldName)}
        />
      )}
    />
  );
};

export default PublicationChannelSearch;

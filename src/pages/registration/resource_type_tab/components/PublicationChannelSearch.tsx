import { getIn, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, TextFieldProps, Typography } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import lightTheme, { autocompleteTranslationProps } from '../../../../themes/lightTheme';
import { Publisher, Registration } from '../../../../types/registration.types';
import { PublicationTableNumber } from '../../../../utils/constants';
import useFetchPublishers from '../../../../utils/hooks/useFetchPublishers';

interface PublicationChannelSearchProps
  extends Pick<TextFieldProps, 'label' | 'placeholder' | 'required'>,
    Pick<AutocompleteProps<Publisher, false, false, false>, 'value'> {
  publicationTable: PublicationTableNumber;
  errorFieldName: string;
  setValue: (value?: Publisher) => void;
  dataTestId: string;
}

const PublicationChannelSearch: FC<PublicationChannelSearchProps> = ({
  publicationTable,
  placeholder,
  errorFieldName,
  label,
  setValue,
  value,
  dataTestId,
  required,
}) => {
  const { t } = useTranslation('registration');
  const { setFieldTouched, errors, touched } = useFormikContext<Registration>();
  const [publishers, isLoadingPublishers, handleNewSearchTerm] = useFetchPublishers(publicationTable);

  return (
    <MuiThemeProvider theme={lightTheme}>
      <Autocomplete
        {...autocompleteTranslationProps}
        popupIcon={null}
        options={publishers}
        onBlur={() => setFieldTouched(errorFieldName)}
        onInputChange={(_, newInputValue) => handleNewSearchTerm(newInputValue)}
        value={value}
        onChange={(_, inputValue) => setValue(inputValue as Publisher)}
        loading={isLoadingPublishers}
        getOptionLabel={(option) => option.title ?? ''}
        renderOption={(option, state) => (
          <StyledFlexColumn>
            <Typography variant="subtitle1">
              <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('resource_type.level')}: {option.level}
            </Typography>
          </StyledFlexColumn>
        )}
        renderInput={(params) => (
          <AutocompleteTextField
            {...params}
            label={label}
            required={required}
            isLoading={isLoadingPublishers}
            placeholder={placeholder}
            dataTestId={dataTestId}
            showSearchIcon
            errorMessage={getIn(touched, errorFieldName) && getIn(errors, errorFieldName)}
          />
        )}
      />
    </MuiThemeProvider>
  );
};

export default PublicationChannelSearch;

import React, { FC, useRef, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import JournalField from './JournalField';

import { Registration } from '../../../../types/registration.types';
import { autocompleteTranslationProps } from '../../../../themes/mainTheme';
import useSearchRegistrations from '../../../../utils/hooks/useSearchRegistrations';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import EmphasizeSubstring from '../../../../components/EmphasizeSubstring';
import { StyledFlexColumn } from '../../../../components/styled/Wrappers';
import { JournalPublicationInstance } from '../../../../types/publication_types/journalRegistration.types';

const searchQueryTypes = `(
entityDescription.reference.publicationInstance="JournalArticle" 
OR 
entityDescription.reference.publicationInstance="JournalShortCommunication"
)`;

const registrationIriBase = process.env.REACT_APP_API_URL;

const CorrigendumForField: FC = () => {
  const { t } = useTranslation('registration');
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [searchTerm, setSearchTerm] = useState('');
  const searchQuery = searchTerm ? `${searchQueryTypes} AND *${searchTerm}*` : searchQueryTypes;
  const [journalRegistrations, isLoadingRegistrations] = useSearchRegistrations(searchQuery);

  // Put corrigendumFor in useRef, to avoid fetching again everytime it changes. Only use this as defaultValue.
  const corrigendumForRef = useRef(
    (values.entityDescription.reference.publicationInstance as JournalPublicationInstance).corrigendumFor
  );
  const [initialOriginalArticle, isLoadingInitialOriginalArticle] = useSearchRegistrations(
    `identifier="${corrigendumForRef.current.split('/').pop()}"`
  );

  return (
    <>
      {initialOriginalArticle && (
        <Field name={ReferenceFieldNames.CORRIGENDUM_FOR}>
          {({ field }: FieldProps) => (
            <Autocomplete
              {...autocompleteTranslationProps}
              popupIcon={null}
              debug={false}
              options={journalRegistrations ? journalRegistrations.hits : []}
              onBlur={() => setFieldTouched(field.name)}
              onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
              defaultValue={initialOriginalArticle?.hits[0] ?? null}
              onChange={(_, inputValue) => {
                if (inputValue) {
                  setFieldValue(field.name, `${registrationIriBase}/publication/${inputValue?.id}`);
                } else {
                  setFieldValue(field.name, '');
                }
              }}
              loading={corrigendumForRef.current ? isLoadingInitialOriginalArticle : isLoadingRegistrations}
              getOptionLabel={(option) => option.title}
              renderOption={(option, state) => (
                <StyledFlexColumn>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary">
                  {t('references.level')}: {option.level}
                </Typography> */}
                </StyledFlexColumn>
              )}
              renderInput={(params) => (
                <AutocompleteTextField
                  {...params}
                  label={t('references.original_article')}
                  required
                  isLoading={isLoadingRegistrations}
                  placeholder={t('references.search_for_original_article')}
                  // dataTestId={dataTestId}
                  showSearchIcon
                  // errorMessage={getIn(touched, errorFieldName) && getIn(errors, errorFieldName)}
                />
              )}
            />
          )}
        </Field>
      )}
      {/* <JournalField disabled /> */}
    </>
  );
};

export default CorrigendumForField;

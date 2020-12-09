import React, { FC, useRef, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Truncate from 'react-truncate';

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
  const identifier = corrigendumForRef.current.split('/').pop();
  const [originalArticleSearch, isLoadingOriginalArticleSearch] = useSearchRegistrations(`identifier="${identifier}"`);

  const options =
    originalArticleSearch &&
    originalArticleSearch.hits.length === 1 &&
    (values.entityDescription.reference.publicationInstance as JournalPublicationInstance).corrigendumFor
      .split('/')
      .pop() === originalArticleSearch.hits[0].id
      ? [originalArticleSearch.hits[0]]
      : journalRegistrations
      ? journalRegistrations.hits
      : [];

  return (
    <>
      {originalArticleSearch && (
        <Field name={ReferenceFieldNames.CORRIGENDUM_FOR}>
          {({ field, meta }: FieldProps<string>) => (
            <Autocomplete
              {...autocompleteTranslationProps}
              popupIcon={null}
              options={options}
              onBlur={() => setFieldTouched(field.name)}
              onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
              defaultValue={originalArticleSearch.hits[0] ?? null}
              onChange={(_, inputValue) => {
                if (!inputValue) {
                  setSearchTerm('');
                }
                setFieldValue(field.name, inputValue ? `${registrationIriBase}/publication/${inputValue.id}` : '');
              }}
              loading={corrigendumForRef.current ? isLoadingOriginalArticleSearch : isLoadingRegistrations}
              getOptionLabel={(option) => option.title}
              renderOption={(option, state) => (
                <StyledFlexColumn>
                  <Typography variant="subtitle1">
                    <EmphasizeSubstring text={option.title} emphasized={state.inputValue} />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <Truncate lines={1}>
                      {option.contributors.map((contributor) => contributor.name).join('; ')}
                    </Truncate>
                  </Typography>
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
                  errorMessage={meta.touched && !!meta.error ? meta.error : undefined}
                />
              )}
            />
          )}
        </Field>
      )}
    </>
  );
};

export default CorrigendumForField;

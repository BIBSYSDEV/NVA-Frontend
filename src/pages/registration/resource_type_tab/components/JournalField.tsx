import { Autocomplete, Box, Button, Chip, styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../../../api/commonApi';
import { defaultChannelSearchSize, searchForJournals } from '../../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { StyledInfoBanner } from '../../../../components/styled/Wrappers';
import { NviCandidateContext } from '../../../../context/NviCandidateContext';
import { ResourceFieldNames, contextTypeBaseFieldName } from '../../../../types/publicationFieldNames';
import {
  JournalEntityDescription,
  JournalRegistration,
} from '../../../../types/publication_types/journalRegistration.types';
import { Journal, PublicationChannelType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { keepSimilarPreviousData } from '../../../../utils/searchHelpers';
import { LockedNviFieldDescription } from '../../LockedNviFieldDescription';
import { JournalFormDialog } from './JournalFormDialog';
import { PublicationChannelChipLabel } from './PublicationChannelChipLabel';
import { PublicationChannelOption } from './PublicationChannelOption';

const journalFieldTestId = dataTestId.registrationWizard.resourceType.journalField;

interface JournalFieldProps {
  confirmedContextType: PublicationChannelType;
  unconfirmedContextType: PublicationChannelType;
}

export const StyledChannelContainerBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '1rem',

  gridTemplateColumns: '4fr 1fr',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const StyledCreateChannelButton = styled(Button)(({ theme }) => ({
  height: 'fit-content',
  width: 'fit-content',
  whiteSpace: 'nowrap',
  marginTop: '0.5rem',

  justifySelf: 'end',
  [theme.breakpoints.down('md')]: {
    justifySelf: 'start',
  },
}));

export const JournalField = ({ confirmedContextType, unconfirmedContextType }: JournalFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<JournalRegistration>();
  const { reference, publicationDate } = values.entityDescription as JournalEntityDescription;
  const journalId = reference?.publicationContext.id ?? '';
  const year = publicationDate?.year ?? '';

  const { disableNviCriticalFields } = useContext(NviCandidateContext);

  const [showJournalForm, setShowJournalForm] = useState(false);
  const toggleJournalForm = () => setShowJournalForm(!showJournalForm);

  const [query, setQuery] = useState(!journalId ? (reference?.publicationContext.title ?? '') : '');
  const debouncedQuery = useDebounce(query);
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const journalOptionsQuery = useQuery({
    queryKey: ['journalSearch', debouncedQuery, year, searchSize],
    enabled: debouncedQuery.length > 3 && debouncedQuery === query,
    queryFn: () => searchForJournals(debouncedQuery, year, searchSize),
    meta: { errorMessage: t('feedback.error.get_journals') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedQuery),
  });

  // Fetch Journals with matching ISSN
  const journalsByIssnQuery = useQuery({
    queryKey: [
      'journalsByIssn',
      reference?.publicationContext.printIssn,
      reference?.publicationContext.onlineIssn,
      year,
    ],
    enabled: !journalId && !!(reference?.publicationContext.printIssn || reference?.publicationContext.onlineIssn),
    queryFn: () =>
      searchForJournals(
        reference?.publicationContext.printIssn ?? reference?.publicationContext.onlineIssn ?? '',
        year,
        1
      ),
    meta: { errorMessage: t('feedback.error.get_journals') },
  });

  useEffect(() => {
    // Set Journal with matching ISSN
    if (journalsByIssnQuery.data?.hits.length === 1) {
      setFieldValue(ResourceFieldNames.PublicationContextType, confirmedContextType, false);
      setFieldValue(ResourceFieldNames.PublicationContextId, journalsByIssnQuery.data.hits[0].id);
      setQuery('');
    }
  }, [setFieldValue, journalsByIssnQuery.data, confirmedContextType]);

  const journalQuery = useQuery({
    queryKey: ['channel', journalId],
    enabled: !!journalId,
    queryFn: () => fetchResource<Journal>(journalId),
    meta: { errorMessage: t('feedback.error.get_journal') },
    staleTime: Infinity,
  });

  const options = journalOptionsQuery.data?.hits ?? [];

  return (
    <StyledChannelContainerBox>
      {disableNviCriticalFields && (
        <StyledInfoBanner sx={{ gridColumn: '1/-1' }}>
          <LockedNviFieldDescription fieldLabel={t('registration.resource_type.journal')} />
        </StyledInfoBanner>
      )}
      <Field name={ResourceFieldNames.PublicationContextId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            disabled={disableNviCriticalFields}
            fullWidth
            multiple
            id={journalFieldTestId}
            data-testid={journalFieldTestId}
            aria-labelledby={`${journalFieldTestId}-label`}
            popupIcon={null}
            options={options}
            filterOptions={(options) => options}
            inputValue={query}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setQuery(newInputValue);
              }
              if (reason === 'input' && !newInputValue && reference?.publicationContext.title) {
                setFieldValue(contextTypeBaseFieldName, { type: unconfirmedContextType });
              }
            }}
            onBlur={() => setFieldTouched(field.name, true, false)}
            blurOnSelect
            disableClearable={!query}
            value={reference?.publicationContext.id && journalQuery.data ? [journalQuery.data] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(contextTypeBaseFieldName, {
                  type: confirmedContextType,
                  id: inputValue.pop()?.id,
                });
              } else if (reason === 'removeOption') {
                setFieldValue(contextTypeBaseFieldName, { type: unconfirmedContextType });
              }
              setQuery('');
            }}
            loading={journalOptionsQuery.isFetching || journalQuery.isFetching}
            getOptionLabel={(option) => option.name}
            renderOption={({ key, ...props }, option, state) => (
              <PublicationChannelOption key={option.identifier} props={props} option={option} state={state} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.identifier}
                  data-testid={dataTestId.registrationWizard.resourceType.journalChip}
                  label={<PublicationChannelChipLabel value={option} />}
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('registration.resource_type.journal')}
                isLoading={journalOptionsQuery.isFetching || journalQuery.isFetching}
                placeholder={
                  !reference?.publicationContext.id ? t('registration.resource_type.search_for_title_or_issn') : ''
                }
                showSearchIcon={!reference?.publicationContext.id}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
            slotProps={{
              listbox: {
                component: AutocompleteListboxWithExpansion,

                ...({
                  hasMoreHits: !!journalOptionsQuery.data?.totalHits && journalOptionsQuery.data.totalHits > searchSize,
                  onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
                  isLoadingMoreHits: journalOptionsQuery.isFetching && searchSize > options.length,
                } satisfies AutocompleteListboxWithExpansionProps as any),
              },
            }}
          />
        )}
      </Field>
      {!reference?.publicationContext.id && journalOptionsQuery.isFetched && (
        <>
          <StyledCreateChannelButton variant="outlined" onClick={toggleJournalForm}>
            {t('registration.resource_type.create_journal')}
          </StyledCreateChannelButton>
          <JournalFormDialog
            open={showJournalForm}
            closeDialog={toggleJournalForm}
            initialName={query}
            onCreatedChannel={(newChannel) => {
              setFieldValue(contextTypeBaseFieldName, {
                type: confirmedContextType,
                id: newChannel.id,
              });
              setQuery('');
            }}
          />
        </>
      )}
    </StyledChannelContainerBox>
  );
};

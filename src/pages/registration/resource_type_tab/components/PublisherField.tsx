import { Autocomplete, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../../../api/commonApi';
import { defaultChannelSearchSize, searchForPublishers } from '../../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { PublicationChannelType, Publisher, Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { keepSimilarPreviousData } from '../../../../utils/searchHelpers';
import { StyledChannelContainerBox, StyledCreateChannelButton } from './JournalField';
import { PublicationChannelChipLabel } from './PublicationChannelChipLabel';
import { PublicationChannelOption } from './PublicationChannelOption';
import { PublisherFormDialog } from './PublisherFormDialog';

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

export const PublisherField = () => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<Registration>();
  const { reference, publicationDate } = values.entityDescription as BookEntityDescription;
  const publisher = reference?.publicationContext.publisher;
  const year = publicationDate?.year ?? '';

  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const togglePublisherForm = () => setShowPublisherForm(!showPublisherForm);

  const [query, setQuery] = useState(!publisher?.id ? publisher?.name ?? '' : '');
  const debouncedQuery = useDebounce(query);
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const publisherOptionsQuery = useQuery({
    queryKey: ['publisherSearch', debouncedQuery, year, searchSize],
    enabled: debouncedQuery.length > 3 && debouncedQuery === query,
    queryFn: () => searchForPublishers(debouncedQuery, year, searchSize),
    meta: { errorMessage: t('feedback.error.get_publishers') },
    placeholderData: (data, query) => keepSimilarPreviousData(data, query, debouncedQuery),
  });

  const options = publisherOptionsQuery.data?.hits ?? [];

  useEffect(() => {
    if (
      publisherOptionsQuery.data?.hits.length === 1 &&
      publisher?.name &&
      publisherOptionsQuery.data.hits[0].name.toLowerCase() === publisher.name.toLowerCase()
    ) {
      setFieldValue(ResourceFieldNames.PublicationContextPublisherType, PublicationChannelType.Publisher, false);
      setFieldValue(ResourceFieldNames.PublicationContextPublisherId, publisherOptionsQuery.data.hits[0].id);
      setQuery('');
    }
  }, [setFieldValue, publisher?.name, publisherOptionsQuery.data?.hits]);

  const publisherQuery = useQuery({
    queryKey: ['channel', publisher?.id],
    enabled: !!publisher?.id,
    queryFn: () => fetchResource<Publisher>(publisher?.id ?? ''),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  return (
    <StyledChannelContainerBox>
      <Field name={ResourceFieldNames.PublicationContextPublisherId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            fullWidth
            multiple
            id={publisherFieldTestId}
            data-testid={publisherFieldTestId}
            aria-labelledby={`${publisherFieldTestId}-label`}
            popupIcon={null}
            options={options}
            filterOptions={(options) => options}
            inputValue={query}
            onInputChange={(_, newInputValue, reason) => {
              if (reason !== 'reset') {
                setQuery(newInputValue);
              }
              if (reason === 'input' && !newInputValue && publisher?.name) {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.UnconfirmedPublisher,
                });
              }
            }}
            onBlur={() => setFieldTouched(field.name, true, false)}
            blurOnSelect
            disableClearable={!query}
            value={publisher?.id && publisherQuery.data ? [publisherQuery.data] : []}
            onChange={(_, inputValue, reason) => {
              if (reason === 'selectOption') {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.Publisher,
                  id: inputValue.pop()?.id,
                });
              } else if (reason === 'removeOption') {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.UnconfirmedPublisher,
                });
              }
              setQuery('');
            }}
            loading={publisherOptionsQuery.isFetching || publisherQuery.isFetching}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <PublicationChannelOption key={option.id} props={props} option={option} state={state} />
            )}
            ListboxComponent={AutocompleteListboxWithExpansion}
            ListboxProps={
              {
                hasMoreHits:
                  !!publisherOptionsQuery.data?.totalHits && publisherOptionsQuery.data.totalHits > searchSize,
                onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
                isLoadingMoreHits: publisherOptionsQuery.isFetching && searchSize > options.length,
              } satisfies AutocompleteListboxWithExpansionProps as any
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
                  label={<PublicationChannelChipLabel value={option} />}
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('common.publisher')}
                isLoading={publisherOptionsQuery.isFetching || publisherQuery.isFetching}
                placeholder={!publisher?.id ? t('registration.resource_type.search_for_publisher_placeholder') : ''}
                showSearchIcon={!publisher?.id}
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
          />
        )}
      </Field>
      {!publisher?.id && publisherOptionsQuery.isFetched && (
        <>
          <StyledCreateChannelButton variant="outlined" onClick={togglePublisherForm}>
            {t('registration.resource_type.create_publisher')}
          </StyledCreateChannelButton>
          <PublisherFormDialog
            open={showPublisherForm}
            closeDialog={togglePublisherForm}
            initialName={query}
            onCreatedChannel={(newPublisher) => {
              setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                type: PublicationChannelType.Publisher,
                id: newPublisher.id,
              });
              setQuery('');
            }}
          />
        </>
      )}
    </StyledChannelContainerBox>
  );
};

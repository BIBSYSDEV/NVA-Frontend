import { Autocomplete, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../../../api/commonApi';
import { usePublisherSearch } from '../../../../api/hooks/usePublisherSearch';
import { defaultChannelSearchSize } from '../../../../api/publicationChannelApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { StyledInfoBanner } from '../../../../components/styled/Wrappers';
import { RegistrationFormContext } from '../../../../context/RegistrationFormContext';
import { BookEntityDescription } from '../../../../types/publication_types/bookRegistration.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationChannelType, Publisher, Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useLoggedInUser } from '../../../../utils/hooks/useLoggedInUser';
import { getPublicationChannelPublisherId, isPersonPublisher } from '../../../../utils/registration-helpers';
import { getFullName } from '../../../../utils/user-helpers';
import { LockedNviFieldDescription } from '../../LockedNviFieldDescription';
import { ClaimedChannelInfoBox } from './ClaimedChannelInfoBox';
import { StyledChannelContainerBox, StyledCreateChannelButton } from './JournalField';
import { PublicationChannelChipLabel } from './PublicationChannelChipLabel';
import { PublicationChannelOption } from './PublicationChannelOption';
import { PublisherFormDialog } from './PublisherFormDialog';
import { SelfPublisherOption } from './SelfPublisherOption';
import {
  createPersonPublisher,
  getPublisherOptionKey,
  getSelfPublisherOption,
  isPersonPublisherOption,
  PublisherFieldOption,
  toPersonPublisherOption,
} from './utils/publisher-field-helpers';

const publisherFieldTestId = dataTestId.registrationWizard.resourceType.publisherField;

interface PublisherFieldProps {
  /**
   * Adds an option suggesting the logged-in user as publisher, shown when the field is empty or as long as the
   * search query matches the user's own name.
   */
  showSelfOption?: boolean;
}

/**
 * Formik bound search field for selecting the publisher of a registration.
 */
export const PublisherField = ({ showSelfOption = false }: PublisherFieldProps) => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<Registration>();
  const { reference, publicationDate } = values.entityDescription as BookEntityDescription;
  const publisher = reference?.publicationContext.publisher;
  const personPublisher = isPersonPublisher(publisher) ? publisher : undefined;
  const channelPublisherId = getPublicationChannelPublisherId(publisher);
  const hasSelectedPublisher = !!personPublisher || !!channelPublisherId;

  const user = useLoggedInUser();

  const { disableNviCriticalFields, disableChannelClaimsFields } = useContext(RegistrationFormContext);

  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const togglePublisherForm = () => setShowPublisherForm(!showPublisherForm);

  // A selected publisher is shown as a chip, so the search field is empty when something is selected. A publisher
  // that is only known by name has no chip to be shown in, and its name is put in the search field instead, both to
  // show it and to search for a channel with the same name.
  const [query, setQuery] = useState(hasSelectedPublisher ? '' : (publisher?.name ?? ''));
  const debouncedQuery = useDebounce(query);
  const [searchSize, setSearchSize] = useState(defaultChannelSearchSize);

  // Reset search size when query changes
  useEffect(() => setSearchSize(defaultChannelSearchSize), [debouncedQuery]);

  const publisherOptionsQuery = usePublisherSearch({
    searchTerm: debouncedQuery,
    year: publicationDate?.year,
    size: searchSize,
  });

  const selfOption = showSelfOption
    ? getSelfPublisherOption(query, { name: getFullName(user?.givenName, user?.familyName), id: user?.cristinId ?? '' })
    : undefined;

  const publisherOptions = publisherOptionsQuery.data?.hits ?? [];
  const options: PublisherFieldOption[] = selfOption ? [selfOption, ...publisherOptions] : publisherOptions;

  // A publisher known only by name may be replaced by a confirmed publisher with the same name, but a person may not
  const unconfirmedPublisherName = personPublisher ? '' : publisher?.name;

  useEffect(() => {
    if (
      publisherOptionsQuery.data?.hits.length === 1 &&
      unconfirmedPublisherName &&
      publisherOptionsQuery.data.hits[0].name.toLowerCase() === unconfirmedPublisherName.toLowerCase()
    ) {
      setFieldValue(ResourceFieldNames.PublicationContextPublisherType, PublicationChannelType.Publisher, false);
      setFieldValue(ResourceFieldNames.PublicationContextPublisherId, publisherOptionsQuery.data.hits[0].id);
      setQuery('');
    }
  }, [setFieldValue, unconfirmedPublisherName, publisherOptionsQuery.data?.hits]);

  const publisherQuery = useQuery({
    queryKey: ['channel', channelPublisherId],
    enabled: !!channelPublisherId,
    queryFn: () => fetchResource<Publisher>(channelPublisherId),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  // What to show as a selected chip. The field is `multiple` to get the chip, so MUI wants a list, but it never
  // holds more than one publisher. A person is already stored with its name, while a channel is stored as an id
  // only, and has nothing to show until it has been fetched.
  const selectedPublisher: PublisherFieldOption[] = personPublisher
    ? [toPersonPublisherOption(personPublisher)]
    : publisherQuery.data
      ? [publisherQuery.data]
      : [];

  return (
    <StyledChannelContainerBox>
      {disableNviCriticalFields && (
        <StyledInfoBanner sx={{ gridColumn: '1/-1' }}>
          <LockedNviFieldDescription fieldLabel={t('common.publisher')} />
        </StyledInfoBanner>
      )}
      <Field name={ResourceFieldNames.PublicationContextPublisherId}>
        {({ field, meta }: FieldProps<string>) => (
          <Autocomplete
            disabled={disableNviCriticalFields || disableChannelClaimsFields}
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
              if (reason !== 'reset' && reason !== 'blur') {
                setQuery(newInputValue);
              }
              // Clearing the text removes an unconfirmed publisher. A selected publisher is shown as a chip instead,
              // and is only removed by removing that chip.
              if (reason === 'input' && !newInputValue && publisher?.name && !hasSelectedPublisher) {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.UnconfirmedPublisher,
                });
              }
            }}
            onBlur={() => setFieldTouched(field.name, true, false)}
            blurOnSelect
            disableClearable={!query}
            value={selectedPublisher}
            onChange={(_, newValue, reason) => {
              if (reason === 'selectOption') {
                const newOption = newValue.pop();
                if (!newOption) {
                  return;
                }
                setFieldValue(
                  ResourceFieldNames.PublicationContextPublisher,
                  isPersonPublisherOption(newOption)
                    ? createPersonPublisher(newOption)
                    : { type: PublicationChannelType.Publisher, id: newOption.id }
                );
              } else if (reason === 'removeOption') {
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.UnconfirmedPublisher,
                });
              }
              setQuery('');
            }}
            loading={publisherOptionsQuery.isFetching || publisherQuery.isFetching}
            getOptionLabel={(option) => option.name}
            getOptionKey={getPublisherOptionKey}
            isOptionEqualToValue={(option, value) => getPublisherOptionKey(option) === getPublisherOptionKey(value)}
            renderOption={({ key, ...props }, option, state) =>
              isPersonPublisherOption(option) ? (
                <SelfPublisherOption key={key} props={props} option={option} />
              ) : (
                <PublicationChannelOption key={key} props={props} option={option} state={state} />
              )
            }
            renderValue={(value, getItemProps) =>
              value.map((option, index) => (
                <Chip
                  {...getItemProps({ index })}
                  key={getPublisherOptionKey(option)}
                  data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
                  label={isPersonPublisherOption(option) ? option.name : <PublicationChannelChipLabel value={option} />}
                />
              ))
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('common.publisher')}
                isLoading={publisherOptionsQuery.isFetching || publisherQuery.isFetching}
                placeholder={
                  hasSelectedPublisher ? '' : t('registration.resource_type.search_for_publisher_placeholder')
                }
                errorMessage={meta.touched && !!meta.error ? meta.error : ''}
              />
            )}
            slotProps={{
              listbox: {
                component: AutocompleteListboxWithExpansion,
                ...({
                  hasMoreHits:
                    !!publisherOptionsQuery.data?.totalHits && publisherOptionsQuery.data.totalHits > searchSize,
                  onShowMoreHits: () => setSearchSize(searchSize + defaultChannelSearchSize),
                  isLoadingMoreHits: publisherOptionsQuery.isFetching && searchSize > publisherOptions.length,
                } satisfies AutocompleteListboxWithExpansionProps),
              },
            }}
          />
        )}
      </Field>

      {channelPublisherId && (
        <ClaimedChannelInfoBox channelId={channelPublisherId} channelType={t('common.publisher')} />
      )}

      {!hasSelectedPublisher && publisherOptionsQuery.isFetched && (
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

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
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useLoggedInUser } from '../../../../utils/hooks/useLoggedInUser';
import { getFullName } from '../../../../utils/user-helpers';
import { LockedNviFieldDescription } from '../../LockedNviFieldDescription';
import { ClaimedChannelInfoBox } from './ClaimedChannelInfoBox';
import { StyledChannelContainerBox, StyledCreateChannelButton } from './JournalField';
import { PublicationChannelChipLabel } from './PublicationChannelChipLabel';
import { PublicationChannelOption } from './PublicationChannelOption';
import { PublisherFormDialog } from './PublisherFormDialog';
import { SelfPublisherOption } from './SelfPublisherOption';
import {
  getPublisherOptionKey,
  getSelfPublisherOption,
  isSelfPublisher,
  PublisherFieldOption,
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

  const user = useLoggedInUser();

  const { disableNviCriticalFields, disableChannelClaimsFields } = useContext(RegistrationFormContext);

  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const togglePublisherForm = () => setShowPublisherForm(!showPublisherForm);

  const [query, setQuery] = useState(!publisher?.id ? (publisher?.name ?? '') : '');
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
    ? getSelfPublisherOption(query, {
        name: getFullName(user?.givenName, user?.familyName),
        personId: getIdentifierFromId(user?.cristinId ?? ''),
      })
    : undefined;

  const publisherOptions = publisherOptionsQuery.data?.hits ?? [];
  const options: PublisherFieldOption[] = selfOption ? [selfOption, ...publisherOptions] : publisherOptions;

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
            onChange={(_, selectedOptions, reason) => {
              if (reason === 'selectOption') {
                const selectedOption = selectedOptions.pop();
                if (!selectedOption || isSelfPublisher(selectedOption)) {
                  // TODO: Set the logged-in user as publisher. Until then, selecting the option has no effect.
                  return;
                }
                setFieldValue(ResourceFieldNames.PublicationContextPublisher, {
                  type: PublicationChannelType.Publisher,
                  id: selectedOption.id,
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
            getOptionKey={getPublisherOptionKey}
            renderOption={({ key, ...props }, option, state) =>
              isSelfPublisher(option) ? (
                <SelfPublisherOption key={key} props={props} option={option} />
              ) : (
                <PublicationChannelOption key={key} props={props} option={option} state={state} />
              )
            }
            renderValue={(value, getItemProps) =>
              value.map((option, index) =>
                // The logged-in user is not stored as the field value, so that option can never end up here
                isSelfPublisher(option) ? null : (
                  <Chip
                    {...getItemProps({ index })}
                    key={getPublisherOptionKey(option)}
                    data-testid={dataTestId.registrationWizard.resourceType.publisherChip}
                    label={<PublicationChannelChipLabel value={option} />}
                  />
                )
              )
            }
            renderInput={(params) => (
              <AutocompleteTextField
                {...params}
                required
                label={t('common.publisher')}
                isLoading={publisherOptionsQuery.isFetching || publisherQuery.isFetching}
                placeholder={!publisher?.id ? t('registration.resource_type.search_for_publisher_placeholder') : ''}
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

      {publisher?.id && <ClaimedChannelInfoBox channelId={publisher.id} channelType={t('common.publisher')} />}

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

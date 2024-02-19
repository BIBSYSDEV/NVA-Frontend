import { Autocomplete, Chip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { searchForPublishers } from '../../../api/publicationChannelApi';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { Publisher } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { PublicationChannelChipLabel } from '../../registration/resource_type_tab/components/PublicationChannelChipLabel';

export const PublisherFilters = () => {
  const history = useHistory();
  const [publisherQuery, setPublisherQuery] = useState('');
  const debouncedQuery = useDebounce(publisherQuery);
  const searchParams = new URLSearchParams(history.location.search);
  const publisherParam = searchParams.get(ResultParam.Publisher);

  const handleChange = (selectedValue: Publisher | null) => {
    if (selectedValue) {
      searchParams.set(ResultParam.Publisher, selectedValue.name);
    } else {
      searchParams.delete(ResultParam.Publisher);
    }

    history.push({ search: searchParams.toString() });
  };

  const publisherOptionsQuery = useQuery({
    queryKey: ['publisherSearch', debouncedQuery],
    enabled: debouncedQuery.length > 3 && debouncedQuery === publisherQuery,
    queryFn: () => searchForPublishers(debouncedQuery, '2023'),
    meta: { errorMessage: t('feedback.error.get_publishers') },
  });

  const publisherList = publisherOptionsQuery.data?.hits ?? [];

  return (
    <Autocomplete
      sx={{ minWidth: '15rem' }}
      value={publisherList.find((publisher) => publisher.name === publisherParam) ?? null}
      options={
        debouncedQuery && publisherQuery === debouncedQuery && !publisherOptionsQuery.isLoading
          ? publisherOptionsQuery.data?.hits ?? []
          : []
      }
      filterOptions={(options) => options}
      inputValue={publisherQuery}
      onInputChange={(_, newInputValue) => {
        setPublisherQuery(newInputValue);
      }}
      onChange={(_, newValue) => {
        handleChange(newValue);
      }}
      blurOnSelect
      disableClearable={!publisherQuery}
      loading={publisherOptionsQuery.isFetching}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Typography>{option.name}</Typography>
        </li>
      )}
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
          label={t('common.publisher')}
          isLoading={publisherOptionsQuery.isFetching}
          placeholder={t('registration.resource_type.search_for_publisher')}
          showSearchIcon
        />
      )}
    />
  );
};

import { Autocomplete } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchFundingSources } from '../../../api/cristinApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';

export const FundingSourceFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fundingSourcesQuery = useQuery({
    queryKey: ['fundingSources'],
    queryFn: fetchFundingSources,
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_funding_sources'), variant: 'error' })),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const fundingSourcesList = fundingSourcesQuery.data?.sources ?? [];

  return (
    <Autocomplete
      sx={{ minWidth: '15rem' }}
      options={fundingSourcesList}
      filterOptions={(options, state) => {
        const filter = state.inputValue.toLocaleLowerCase();
        return options.filter((option) => {
          const names = Object.values(option.name).map((name) => name.toLocaleLowerCase());
          const identifier = option.identifier.toLocaleLowerCase();
          return identifier.includes(filter) || names.some((name) => name.includes(filter));
        });
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.identifier}>
          {getLanguageString(option.name)}
        </li>
      )}
      disabled={!fundingSourcesQuery.data}
      getOptionLabel={(option) => getLanguageString(option.name)}
      //   onChange={(_, value) => setFieldValue(field.name, value?.id)}
      renderInput={(params) => (
        <AutocompleteTextField
          data-testid={dataTestId.registrationWizard.description.fundingSourceSearchField}
          {...params}
          label={t('registration.description.funding.funder')}
          isLoading={fundingSourcesQuery.isLoading}
          placeholder={t('common.search')}
          showSearchIcon
          multiline
          required
        />
      )}
    />
  );
};

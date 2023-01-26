import { Autocomplete } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { SearchResponse } from '../../../types/common.types';
import { NfrProject } from '../../../types/project.types';
import { Funding, Registration } from '../../../types/registration.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useFetch } from '../../../utils/hooks/useFetch';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NfrProjectSearchProps {
  baseFieldName: string;
}

export const NfrProjectSearch = ({ baseFieldName }: NfrProjectSearchProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<Registration>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [nfrProjectSearch, isLoadingNfrProjectSearch] = useFetch<SearchResponse<NfrProject>>({
    url: debouncedSearchTerm ? `/verified-funding/nfr?term=${debouncedSearchTerm}&size=20` : '',
  });
  const projects = nfrProjectSearch?.hits ?? [];

  return (
    <>
      <Autocomplete
        options={projects}
        filterOptions={(options) => options}
        onInputChange={(_, newInputValue, reason) => {
          if (reason !== 'reset') {
            // Autocomplete triggers "reset" events after input change when it's controlled. Ignore these.
            setSearchTerm(newInputValue);
          }
        }}
        getOptionLabel={(option) => getLanguageString(option.name)}
        renderOption={(props, option) => (
          //  TODO: Check if identical names are expected. If not, remove renderOption?
          <li {...props} key={option.identifier}>
            {getLanguageString(option.name)}
          </li>
        )}
        onChange={(event, value) => {
          if (value) {
            const { name, lead, ...rest } = value;
            const nfrFunding: Funding = {
              type: 'Funding',
              ...rest,
              name: getLanguageString(name),
            };
            setFieldValue(baseFieldName, nfrFunding);
          }
        }}
        renderInput={(params) => (
          <AutocompleteTextField
            {...params}
            label={t('registration.description.funding.funder')}
            isLoading={isLoadingNfrProjectSearch}
            placeholder={t('registration.description.funding.funder_filter')}
            showSearchIcon
          />
        )}
      />
    </>
  );
};

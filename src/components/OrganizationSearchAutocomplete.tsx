import { Autocomplete, AutocompleteProps } from '@mui/material';
import { Organization } from '../types/organization.types';
import { dataTestId } from '../utils/dataTestIds';
import { getIdentifierFromId } from '../utils/general-helpers';
import { getLanguageString } from '../utils/translation-helpers';
import { OrganizationRenderOption } from './OrganizationRenderOption';

type OrganizationSearchAutocompleteProps = Omit<
  AutocompleteProps<Organization, false, false, false>,
  'getOptionLabel' | 'getOptionKey' | 'renderOption' | 'filterOptions'
>;

/**
 * An Autocomplete for picking a single organization from a given list of options (`options`), matching on either
 * its display label or its identifier (the trailing segment of its id) as the user types. Forwards every other
 * Autocomplete prop as-is, so callers control `value`/`onChange`, `renderInput`, sizing etc. themselves - it only
 * fixes the label/option-key/render/filter behavior that's otherwise repeated wherever organizations are searched.
 */
export const OrganizationSearchAutocomplete = (props: OrganizationSearchAutocompleteProps) => (
  <Autocomplete
    data-testid={dataTestId.editor.organizationOverviewSearchField}
    {...props}
    getOptionLabel={(option) => getLanguageString(option.labels)}
    getOptionKey={(option) => option.id}
    renderOption={({ key, ...renderProps }, option) => (
      <OrganizationRenderOption key={option.id} props={renderProps} option={option} />
    )}
    filterOptions={(options, state) =>
      options.filter(
        (option) =>
          Object.values(option.labels).some((label) => label.toLowerCase().includes(state.inputValue.toLowerCase())) ||
          getIdentifierFromId(option.id).includes(state.inputValue)
      )
    }
  />
);

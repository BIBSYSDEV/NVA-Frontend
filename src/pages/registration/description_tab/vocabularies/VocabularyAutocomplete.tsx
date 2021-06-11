import { TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { Category } from '../../../../types/vocabulary.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export interface VocabularyComponentProps {
  selectedIds: string[];
  addValue: (value: string) => void;
  removeValue: (value: string) => void;
  clear: () => void;
}

interface VocabularyAutocompleteProps
  extends VocabularyComponentProps,
    Pick<TextFieldProps, 'label'>,
    Pick<AutocompleteProps<Category, true, false, false>, 'id' | 'options' | 'renderOption'> {}

export const VocabularyAutocomplete = ({
  selectedIds,
  addValue,
  removeValue,
  clear,
  label,
  id,
  options,
  renderOption,
}: VocabularyAutocompleteProps) => {
  const selectedOptions = options.filter((option) => selectedIds.includes(option.id));

  return (
    <Autocomplete
      id={id}
      aria-labelledby={`${id}-label`}
      options={options}
      value={selectedOptions}
      getOptionLabel={(option) => getLanguageString(option.label)}
      renderOption={renderOption}
      onChange={(event, value, reason, selectedValue) => {
        if (reason === 'select-option' && selectedValue) {
          addValue(selectedValue.option.id);
        } else if (reason === 'remove-option' && selectedValue) {
          removeValue(selectedValue.option.id);
        } else if (reason === 'clear') {
          clear();
        }
      }}
      multiple
      renderInput={(params) => <TextField {...params} label={label} variant="filled" />}
    />
  );
};

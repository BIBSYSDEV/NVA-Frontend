import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material';
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
  const selectedOptions = selectedIds
    .map((id) => options.find((option) => option.id === id))
    .filter((item) => !!item) as Category[];

  return (
    <Autocomplete
      id={id}
      aria-labelledby={`${id}-label`}
      options={options}
      value={selectedOptions}
      getOptionLabel={(option) => getLanguageString(option.label)}
      renderOption={renderOption}
      onChange={(event, value, reason, selectedValue) => {
        if (reason === 'selectOption' && selectedValue) {
          addValue(selectedValue.option.id);
        } else if (reason === 'removeOption' && selectedValue) {
          removeValue(selectedValue.option.id);
        } else if (reason === 'clear') {
          clear();
        }
      }}
      multiple
      fullWidth
      renderInput={(params) => <TextField {...params} label={label} variant="filled" />}
    />
  );
};

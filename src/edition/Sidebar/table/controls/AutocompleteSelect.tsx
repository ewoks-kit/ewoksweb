import { Autocomplete } from '@mui/material';
import { FormControl, TextField } from '@mui/material';

import type { TypeOfValues } from '../../../../types';

interface Props {
  value: string | number;
  onChange: (newValue: string) => void;
  typeOfValues?: TypeOfValues;
  disable?: boolean;
  ariaLabel?: string;
}

function AutocompleteSelect(props: Props) {
  const { value: rawValue, onChange, typeOfValues, disable, ariaLabel } = props;

  const value = String(rawValue);

  const options = typeOfValues?.values || [''];
  return (
    <FormControl variant="standard" fullWidth>
      <Autocomplete
        disabled={disable}
        disableClearable
        freeSolo={options.length === 0}
        options={options}
        renderOption={(liProps, option) => {
          const valueIsRequired =
            typeOfValues?.requiredValues?.includes(option);

          return (
            <li {...liProps}>
              {option}
              {valueIsRequired && <span style={{ color: 'red' }}>*</span>}
            </li>
          );
        }}
        value={value}
        inputValue={value}
        onChange={(e, val) => onChange(val)}
        onInputChange={(e, val) => onChange(val)}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            margin="normal"
            inputProps={{
              ...params.inputProps,
              'aria-label': ariaLabel,
            }}
          />
        )}
      />
    </FormControl>
  );
}

export default AutocompleteSelect;

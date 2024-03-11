import { Autocomplete } from '@mui/material';
import { FormControl, TextField } from '@mui/material';

import type { Options } from '../../../../types';

interface Props {
  value: string | number;
  onChange: (newValue: string) => void;
  options: Options;
  disable?: boolean;
  ariaLabel?: string;
}

function AutocompleteSelect(props: Props) {
  const {
    value: rawValue,
    onChange,
    options: rawOptions,
    disable,
    ariaLabel,
  } = props;

  const { values: options, requiredValues } = rawOptions;

  const value = String(rawValue);

  return (
    <FormControl variant="standard" fullWidth>
      <Autocomplete
        disabled={disable}
        disableClearable
        freeSolo={options.length === 0}
        options={options}
        renderOption={(liProps, option) => {
          const valueIsRequired = requiredValues.includes(option);

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

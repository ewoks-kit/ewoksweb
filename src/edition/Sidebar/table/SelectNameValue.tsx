import { Autocomplete } from '@mui/lab';
import { FormControl, TextField } from '@mui/material';

import type { CustomTableCellProps } from '../../../types';

function SelectNameValue(props: CustomTableCellProps) {
  const { index, row, name, onChange, typeOfValues, disable } = props;

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
        value={(row[name] as string) || ''}
        onChange={(e, val) =>
          onChange({ target: { value: val, name } }, row, index)
        }
        onInputChange={(e, val) =>
          onChange({ target: { value: val, name } }, row, index)
        }
        renderInput={(params) => (
          <TextField variant="standard" {...params} margin="normal" />
        )}
      />
    </FormControl>
  );
}

export default SelectNameValue;

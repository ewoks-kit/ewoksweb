import { Autocomplete } from '@mui/material';
import { FormControl, TextField } from '@mui/material';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../../types';

interface Props {
  row: InputTableRow;
  name: 'name' | 'value';
  onChange: (e: RowChangeEvent) => void;
  typeOfValues?: TypeOfValues;
  disable?: boolean;
}

function AutocompleteSelect(props: Props) {
  const { row, name, onChange, typeOfValues, disable } = props;

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
        inputValue={(row[name] as string) || ''}
        onChange={(e, val) => onChange({ target: { value: val, name } })}
        onInputChange={(e, val) => onChange({ target: { value: val, name } })}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            margin="normal"
            inputProps={{
              ...params.inputProps,
              'aria-label': `Edit input ${name}`,
            }}
          />
        )}
      />
    </FormControl>
  );
}

export default AutocompleteSelect;

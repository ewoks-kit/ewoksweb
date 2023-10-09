import { Autocomplete } from '@mui/lab';
import { FormControl, TextField, Typography } from '@mui/material';

import type { CustomTableCellProps } from '../../../types';

function SelectNameValue(props: CustomTableCellProps) {
  const { index, row, name, onChange, typeOfValues, disable } = props;

  const renderOption = (option: string) => {
    const valueIsRequired = typeOfValues?.requiredValues?.includes(option);

    return (
      <Typography component="div" variant="body1">
        {option}
        {valueIsRequired && <span style={{ color: 'red' }}>*</span>}
      </Typography>
    );
  };

  const options = typeOfValues?.values || [''];
  return (
    <FormControl fullWidth>
      <Autocomplete
        disabled={disable}
        disableClearable
        freeSolo={options.length === 0}
        options={options}
        renderOption={renderOption}
        value={(row[name] as string) || ''}
        onChange={(e, val) =>
          onChange({ target: { value: val, name } }, row, index)
        }
        onInputChange={(e, val) =>
          onChange({ target: { value: val, name } }, row, index)
        }
        renderInput={(params) => <TextField {...params} margin="normal" />}
        data-cy="autocompleteInputInEditableCell"
      />
    </FormControl>
  );
}

export default SelectNameValue;

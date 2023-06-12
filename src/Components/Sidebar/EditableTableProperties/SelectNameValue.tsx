import { FormControl, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import type { CustomTableCellProps } from '../../../types';

function SelectRenderer(props: CustomTableCellProps) {
  const { index, row, name, onChange, values } = props;

  const renderOption = (option: string) => {
    const valueIsRequired = values.requiredValues?.includes(option);

    return (
      <li>
        <Typography component="div" variant="body1">
          {option}
          {valueIsRequired && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      </li>
    );
  };

  const options = values.values || [];
  return (
    <FormControl fullWidth>
      <Autocomplete
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

export default SelectRenderer;

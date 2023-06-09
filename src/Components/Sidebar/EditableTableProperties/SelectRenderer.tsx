import { FormControl, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import type { CustomTableCellProps } from '../../../types';

function SelectRenderer(props: CustomTableCellProps) {
  const { index, row, name, onChange, typeOfValues } = props;

  const renderOption = (option: string) => {
    const valueIsRequired = typeOfValues.requiredValues?.includes(option);

    return (
      <li>
        <Typography
          component="div"
          variant="body1"
          style={
            valueIsRequired ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
          }
        >
          {valueIsRequired ? `${option}*` : option}
        </Typography>
      </li>
    );
  };

  const options = typeOfValues.values || [''];
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

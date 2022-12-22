import { FormControl, MenuItem, Select, TableCell } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import { INPUT_TYPES } from './utils';

interface Props {
  value: string;
  className?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function TypeSelectCell(props: Props) {
  const { value, disabled, className, onChange } = props;

  return (
    <TableCell align="left" size="small" className={className}>
      <FormControl disabled={disabled}>
        <Select value={value} label="Task type" onChange={onChange}>
          {INPUT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </TableCell>
  );
}

export default TypeSelectCell;

import { FormControl, MenuItem, Select, TableCell } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import type { PropertyChangedEvent } from '../../../types';
import { INPUT_TYPES } from './utils';

interface Props {
  value: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function TypeSelectCell(props: Props) {
  const { value, className, onChange } = props;

  function onChangeLocal(event: PropertyChangedEvent) {
    if (onChange) {
      onChange(event as ChangeEvent<HTMLInputElement>);
    }
  }

  return (
    <TableCell align="left" size="small" className={className}>
      <FormControl fullWidth>
        {/* paddingTop: '8px' */}
        <Select
          value={value}
          label="Task type"
          onChange={onChangeLocal}
          style={{ fontSize: '14px' }}
        >
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

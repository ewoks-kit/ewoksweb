import type { SelectChangeEvent } from '@mui/material';
import { FormControl, MenuItem, Select, TableCell } from '@mui/material';
import type { ChangeEvent } from 'react';

import { INPUT_TYPES } from '../utils';
import styles from './TypeSelectCell.module.css';

interface Props {
  value: string;
  disable?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function TypeSelectCell(props: Props) {
  const { value, disable, onChange } = props;

  function onChangeLocal(event: SelectChangeEvent) {
    if (onChange) {
      onChange(event as ChangeEvent<HTMLInputElement>);
    }
  }

  return (
    <TableCell className={styles.cell} align="left" size="small">
      <FormControl variant="standard" fullWidth>
        <Select
          variant="standard"
          disabled={disable}
          value={value}
          label="Task type"
          onChange={onChangeLocal}
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

import { FormControl, MenuItem, Select, TableCell } from '@mui/material';

import { RowType } from '../../../../types';
import styles from './TypeSelectCell.module.css';

interface Props {
  value: RowType;
  onChange: (newType: RowType) => void;
  disable?: boolean;
}

function TypeSelectCell(props: Props) {
  const { value, disable, onChange } = props;

  return (
    <TableCell className={styles.cell} align="left" size="small">
      <FormControl variant="standard" fullWidth>
        <Select
          variant="standard"
          disabled={disable}
          value={value}
          onChange={(e) => onChange(e.target.value as RowType)}
          inputProps={{ 'aria-label': 'Change input type' }}
        >
          {Object.values(RowType).map((type) => (
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

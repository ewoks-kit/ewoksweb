import { EditOutlined as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import type { CustomTableCellProps, InputTableRow } from 'types';

import styles from './CustomTableCell.module.css';
import TableCellInEditMode from './TableCellInEditMode';

function isRowContentInvalid(
  row: InputTableRow,
  rowNames: string[] | undefined,
  name: string,
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions',
) {
  const hasInvalidValue = row.value === undefined || row.value === '';

  const forEditableTableDuplicateName =
    name === 'name' &&
    usedIn !== 'DataMapping' &&
    rowNames !== undefined &&
    rowNames.filter((ro) => ro === row.name).length > 1;

  return !row.name || hasInvalidValue || forEditableTableDuplicateName;
}

function CustomTableCell(props: CustomTableCellProps) {
  const { row, rowsNames, name, usedIn, disable: inactive, onEdit } = props;

  return (
    <TableCell
      align="left"
      className={styles.cell}
      style={{
        width: name === 'value' || usedIn === 'DataMapping' ? '50%' : '30%',
        ...(inactive && { pointerEvents: 'none' }),
        borderBottom: isRowContentInvalid(row, rowsNames, name, usedIn)
          ? 'solid'
          : 'none',
        borderColor: isRowContentInvalid(row, rowsNames, name, usedIn)
          ? 'rgb(249, 81, 81)'
          : 'white',
      }}
    >
      {name === 'value' &&
      row.type &&
      ['dict', 'list', 'object'].includes(row.type) ? (
        <span className={styles.icon}>
          {row[name] && typeof row[name] === 'object'
            ? JSON.stringify(row[name])
            : ''}

          <IconButton
            disabled={inactive}
            size="small"
            aria-label="edit"
            onClick={() => {
              onEdit?.();
            }}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </span>
      ) : (
        <TableCellInEditMode {...props} />
      )}
    </TableCell>
  );
}

export default CustomTableCell;

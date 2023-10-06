import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { EditOutlined as EditIcon } from '@material-ui/icons';
import type { CustomTableCellProps, EditableTableRow } from 'types';

import TableCellInEditMode from './TableCellInEditMode';

function isRowContentInvalid(
  row: EditableTableRow,
  rowNames: string[] | undefined,
  name: string,
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions',
) {
  const hasInvalidValue = row.value === undefined || row.value === '';

  const forEditableTableDublicateName =
    name === 'name' &&
    usedIn !== 'DataMapping' &&
    rowNames !== undefined &&
    rowNames.filter((ro) => ro === row.name).length > 1;

  return !row.name || hasInvalidValue || forEditableTableDublicateName;
}

// DOC: Used as an app-wide dialog when confirmation is needed. Open is a prop
function CustomTableCell(props: CustomTableCellProps) {
  const { row, rowsNames, name, usedIn, disable: inactive } = props;

  const useStyles = makeStyles(() => ({
    tableCell: {
      width: name === 'value' || usedIn === 'DataMapping' ? '50%' : '30%',
      height: 15,
      padding: '0 5px 0 0',
      '& input': {
        fontSize: '14px',
      },
      '& .MuiFormControl-marginNormal': {
        margin: '0px',
      },
    },
  }));
  const classes = useStyles();

  return (
    <TableCell
      align="left"
      className={classes.tableCell}
      style={{
        padding: '0 4px',
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
        <span style={{ paddingLeft: '8px' }}>
          {row[name] && typeof row[name] === 'object'
            ? JSON.stringify(row[name])
            : ''}

          <IconButton
            disabled={inactive}
            size="small"
            aria-label="edit"
            onClick={() => {
              if (typeof props.onEdit === 'function') {
                props.onEdit();
              }
            }}
            color="primary"
            data-cy="editButtonEditableTable"
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

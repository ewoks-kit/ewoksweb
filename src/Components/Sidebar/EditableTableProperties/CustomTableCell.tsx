import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import TableCellInEditMode from './TableCellInEditMode';
import type { CustomTableCellProps, EditableTableRow } from 'types';
import { IconButton } from '@material-ui/core';
import { EditOutlined as EditIcon } from '@material-ui/icons';

function isRowContentInvalid(
  row: EditableTableRow,
  rowNames: string[],
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions'
) {
  const hasInvalidValue = row.value === undefined || row.value === '';

  const forEditableTableDublicateName =
    usedIn !== 'DataMapping' &&
    rowNames.filter((ro) => ro === row.name).length > 1;

  return !row.name || hasInvalidValue || forEditableTableDublicateName;
}

// DOC: Used as an app-wide dialog when confirmation is needed. Open is a prop
function CustomTableCell(props: CustomTableCellProps) {
  const { row, rowsNames, name, usedIn, type, typeOfValues } = props;
  console.log(row, rowsNames, name, usedIn, type, typeOfValues);

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
        borderBottom: isRowContentInvalid(row, rowsNames || [], usedIn)
          ? 'solid'
          : 'none',
        borderColor: isRowContentInvalid(row, rowsNames || [], usedIn)
          ? 'rgb(249, 81, 81)'
          : 'white',
      }}
    >
      {type && ['list', 'dict'].includes(type) ? (
        <span style={{ paddingLeft: '8px' }}>
          {row[name] && typeof row[name] === 'object'
            ? JSON.stringify(row[name])
            : ''}

          <IconButton
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

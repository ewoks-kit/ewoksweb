import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import TableCellInEditMode from './TableCellInEditMode';
import type { CustomTableCellProps, EditableTableRow } from 'types';
import { IconButton } from '@material-ui/core';
import { EditOutlined as EditIcon } from '@material-ui/icons';

function isRowContentInValid(
  row: EditableTableRow,
  rowNames: string[],
  type?: string
) {
  return (
    !row.name ||
    row.value === undefined ||
    row.value === '' ||
    (type && rowNames.filter((ro) => ro === row.name).length > 1)
  );
}

// DOC: Used as an app-wide dialog when confirmation is needed. Open is a prop
function CustomTableCell(props: CustomTableCellProps) {
  const { row, rowsNames, name, headers, type } = props;

  const useStyles = makeStyles(() => ({
    tableCell: {
      width: name === 'value' || headers?.includes('Source') ? '50%' : '30%',
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
        borderBottom: isRowContentInValid(row, rowsNames || [], type)
          ? 'solid'
          : 'none',
        borderColor: isRowContentInValid(row, rowsNames || [], type)
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

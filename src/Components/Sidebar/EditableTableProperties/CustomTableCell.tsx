import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import TableCellInEditMode from './TableCellInEditMode';
import type { CustomTableCellProps } from 'types';
import { IconButton } from '@material-ui/core';
import { EditOutlined as EditIcon } from '@material-ui/icons';

// DOC: Used as an app-wide dialog when confirmation is needed. Open is a prop
function CustomTableCell(props: CustomTableCellProps) {
  const { row, name, headers, type } = props;
  const useStyles = makeStyles(() => ({
    tableCell: {
      width: name === 'value' || headers?.includes('Source') ? '50%' : '30%',
      height: 15,
      padding: '0px 10px 0px 0px',
    },
  }));
  const classes = useStyles();

  return (
    <TableCell align="left" className={classes.tableCell}>
      {/* In edit mode the type comes from sidebar in data-mapping and
      from the selected type here for conditions and default-values */}
      {['list', 'dict'].includes(type || '') ? ( // {row[name] && typeof row[name] === 'object' ? (
        <span>
          {JSON.stringify(row[name])}

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

import { IconButton, TableCell } from '@material-ui/core';
import { useStyles } from './EditableTable';
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';

interface Props {
  disableSave?: boolean;
  onSave: () => void;
  onDelete: () => void;
}

function ToolsCell(props: Props) {
  const { disableSave, onSave, onDelete } = props;
  const classes = useStyles();

  return (
    <TableCell
      className={classes.selectTableCell}
      style={{ borderBottom: 'none', display: 'flex', width: '42px' }}
    >
      <IconButton
        style={{
          color: disableSave ? '#c2c8ea' : 'rgb(108, 128, 236)',
          width: '50%',
        }}
        onClick={() => onSave()}
        className={classes.root}
        aria-label="edit"
        data-cy="doneEditingButtonEditableTable"
        disabled={disableSave}
      >
        <SaveIcon />
      </IconButton>
      <IconButton
        style={{ color: 'rgb(108, 128, 236)', width: '50%' }}
        className={classes.root}
        onClick={() => onDelete()}
        aria-label="delete"
        data-cy="deleteButtonEditableTable"
      >
        <DeleteIcon />
      </IconButton>
    </TableCell>
  );
}

export default ToolsCell;

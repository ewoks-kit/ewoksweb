import { IconButton, TableCell } from '@material-ui/core';
import { useStyles } from './EditableTable';
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';

interface Props {
  onSave: () => void;
  onDelete: () => void;
}

function ToolsCell(props: Props) {
  const { onSave, onDelete } = props;
  const classes = useStyles();

  return (
    <TableCell className={classes.selectTableCell}>
      <IconButton
        style={{ color: '#c2c8ea' }}
        onClick={() => onSave()}
        className={classes.root}
        aria-label="edit"
        data-cy="doneEditingButtonEditableTable"
      >
        <SaveIcon fontSize="small" />
      </IconButton>
      <IconButton
        style={{ color: 'rgb(249, 200, 200)' }}
        className={classes.root}
        onClick={() => onDelete()}
        aria-label="delete"
        data-cy="deleteButtonEditableTable"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </TableCell>
  );
}

export default ToolsCell;

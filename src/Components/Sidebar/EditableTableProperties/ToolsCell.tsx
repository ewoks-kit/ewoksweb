import { Fab, IconButton, TableCell } from '@material-ui/core';
import { useStyles } from './EditableTable';
import {
  EditOutlined as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

interface Props {
  onSave: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing?: boolean;
}

function ToolsCell(props: Props) {
  const { isEditing, onSave, onEdit, onDelete } = props;
  const classes = useStyles();

  return (
    <TableCell className={classes.selectTableCell}>
      {isEditing ? (
        <IconButton
          color="inherit"
          onClick={() => onSave()}
          className={classes.root}
          aria-label="edit"
          data-cy="doneEditingButtonEditableTable"
        >
          <Fab
            // className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
          >
            <SaveIcon fontSize="small" />
          </Fab>
        </IconButton>
      ) : (
        <span>
          <IconButton
            className={classes.root}
            aria-label="edit"
            onClick={() => onEdit()}
            color="primary"
            data-cy="editButtonEditableTable"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            className={classes.root}
            onClick={() => onDelete()}
            aria-label="delete"
            data-cy="deleteButtonEditableTable"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      )}
    </TableCell>
  );
}

export default ToolsCell;

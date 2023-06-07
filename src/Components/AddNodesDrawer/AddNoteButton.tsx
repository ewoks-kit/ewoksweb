import { Tooltip } from '@material-ui/core';
import { Textsms } from '@material-ui/icons';
import { onDragStart } from './utils';

function AddNoteButton() {
  return (
    <span
      role="button"
      tabIndex={0}
      key="addNote"
      className="dndnode"
      onDragStart={(event) =>
        onDragStart(event, {
          task_identifier: 'note',
          task_type: 'note',
          icon: Textsms,
        })
      }
      draggable
    >
      <Tooltip title="add note" arrow>
        <Textsms fontSize="large" />
      </Tooltip>
    </span>
  );
}

export default AddNoteButton;

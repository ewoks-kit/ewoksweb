import { Tooltip } from '@material-ui/core';
import { Textsms } from '@material-ui/icons';
import { attachTaskInfo } from '../Canvas/utils';

function AddNoteButton() {
  return (
    <span
      role="button"
      tabIndex={0}
      key="addNote"
      className="dndnode"
      onDragStart={(event) => {
        attachTaskInfo(event.dataTransfer, {
          task_identifier: 'note',
          task_type: 'note',
        });
      }}
      draggable
    >
      <Tooltip title="add note" arrow>
        <Textsms fontSize="large" />
      </Tooltip>
    </span>
  );
}

export default AddNoteButton;

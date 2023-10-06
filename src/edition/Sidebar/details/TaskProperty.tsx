import { IconButton } from '@material-ui/core';
import { EditOutlined as EditIcon } from '@material-ui/icons';
import { useState } from 'react';

import styles from './Details.module.css';
import IdentifierEditDialog from './IdentifierEditDialog';

interface TaskPropertyProps {
  id: string;
  label: string;
  value?: string | string[];
  editable?: boolean;
  onPropChange?(props: EditableNodeProps): void;
}
interface EditableNodeProps {
  task_identifier?: string;
}
// DOC: For editing Node properties related to the Task it is based on
function TaskProperty(props: TaskPropertyProps) {
  const { id, label, value, editable = false } = props;

  const [open, setOpen] = useState(false);

  function handlePropSave(propertyValue: string) {
    if (props.onPropChange) {
      props.onPropChange({ [id]: propertyValue });
    }
  }

  function handleDialogClose() {
    setOpen(false);
  }

  const valueAsStr = Array.isArray(value) ? value.join(', ') : value;

  if (!valueAsStr) {
    return <span />;
  }

  return (
    <>
      <div className={styles.entry} data-cy="task_props">
        <span>{label}:</span> {valueAsStr}
        {editable && (
          <IconButton
            size="small"
            aria-label="edit"
            onClick={() => setOpen(true)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <IdentifierEditDialog
        task_identifier={value as string}
        open={open}
        onDialogClose={handleDialogClose}
        onPropSave={handlePropSave}
      />
    </>
  );
}
export default TaskProperty;

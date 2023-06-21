import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';
import { IconButton } from '@material-ui/core';
import TextButtonSave from './TextButtonSave';

import styles from './Details.module.css';

interface EditTaskProps {
  id: string;
  label: string;
  value: string;
  editProps: boolean;
  propChanged(props: editableNodeProps): void;
}
interface editableNodeProps {
  task_identifier?: string;
  task_type?: string;
  task_generator?: string;
}
// DOC: For editing Node properties related to the Task it is based on
function EditTaskProp(props: EditTaskProps) {
  const { id, label, value, editProps } = props;

  const [editProp, setEditProp] = useState(false);
  const [taskProp, setTaskProp] = useState('');

  useEffect(() => {
    setTaskProp(value);
    if (!editProps) {
      setEditProp(false);
    }
  }, [value, editProps]);

  function onEditProp() {
    setEditProp(!editProp);
  }

  function handleTaskPropChange(taskP: string) {
    setTaskProp(taskP);
    props.propChanged({ [id]: taskP });
  }

  return (
    <>
      <div className={styles.entry}>
        {editProps && (
          <IconButton
            style={{ padding: '1px' }}
            aria-label="edit"
            onClick={onEditProp}
          >
            <EditIcon />
          </IconButton>
        )}
        {!editProp && (
          <>
            <b>{label}: </b>
            <span>{value}</span>
          </>
        )}
      </div>
      {editProp && (
        <div>
          <TextButtonSave
            label="Identifier"
            defaultValue={taskProp || ''}
            onValueSave={(val) => handleTaskPropChange(val)}
          />
        </div>
      )}
    </>
  );
}
export default EditTaskProp;

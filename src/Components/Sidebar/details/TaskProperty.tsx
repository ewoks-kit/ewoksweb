import TextAutosave from './TextAutosave';

import styles from './Details.module.css';
import { useEffect, useState } from 'react';

interface TaskPropertyProps {
  id: string;
  label: string;
  value: string | string[];
  editable: boolean;
  onPropChange(props: editableNodeProps): void;
}
interface editableNodeProps {
  task_identifier?: string;
  task_type?: string;
  task_generator?: string;
}
// DOC: For editing Node properties related to the Task it is based on
function TaskProperty(props: TaskPropertyProps) {
  const { id, label, value, editable } = props;
  // console.log(id, label, value, editable);

  const [val, setVal] = useState(value);

  useEffect(() => {
    console.log(value);

    setVal(value);
  }, [value]);

  function handleTaskPropChange(taskP: string) {
    props.onPropChange({ [id]: taskP });
  }

  return editable ? (
    <div className={styles.entry}>
      <TextAutosave
        label={label}
        defaultValue={val || ''}
        onValueSave={(val) => handleTaskPropChange(val)}
      />
    </div>
  ) : (
    <div key={id}>
      <b>{label}:</b> {Array.isArray(value) ? value.join(', ') : value}
    </div>
  );
}
export default TaskProperty;

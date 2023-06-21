import TextAutosave from './TextAutosave';

import styles from './Details.module.css';

interface EditTaskProps {
  id: string;
  label: string;
  value: string;
  onPropChange(props: editableNodeProps): void;
}
interface editableNodeProps {
  task_identifier?: string;
  task_type?: string;
  task_generator?: string;
}
// DOC: For editing Node properties related to the Task it is based on
function EditTaskProp(props: EditTaskProps) {
  const { id, label, value } = props;

  function handleTaskPropChange(taskP: string) {
    props.onPropChange({ [id]: taskP });
  }

  return (
    <div className={styles.entry}>
      <TextAutosave
        label={label}
        defaultValue={value || ''}
        onValueSave={(val) => handleTaskPropChange(val)}
      />
    </div>
  );
}
export default EditTaskProp;

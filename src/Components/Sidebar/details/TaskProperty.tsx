import styles from './Details.module.css';
import { EditOutlined as EditIcon } from '@material-ui/icons';

interface TaskPropertyProps {
  id: string;
  label: string;
  value?: string | string[];
  editable?: boolean;
  onPropChange?(props: editableNodeProps): void;
}
interface editableNodeProps {
  task_identifier?: string;
  task_type?: string;
  task_generator?: string;
}
// DOC: For editing Node properties related to the Task it is based on
function TaskProperty(props: TaskPropertyProps) {
  const { id, label, value, editable } = props;

  // TODO: To be used by a dialog in the next MR
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleTaskPropChange(taskP: string) {
    if (props.onPropChange) {
      props.onPropChange({ [id]: taskP });
    }
  }

  return (
    <span className={styles.entry}>
      <div key={id}>
        <b>{label}:</b> {Array.isArray(value) ? value.join(', ') : value}
        {editable && <EditIcon fontSize="small" />}
      </div>
    </span>
  );
}
export default TaskProperty;

import styles from './Details.module.css';
import { EditOutlined as EditIcon } from '@material-ui/icons';

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

  // TODO: To be used by a dialog in the next MR
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleTaskPropChange(propertyValue: string) {
    if (props.onPropChange) {
      props.onPropChange({ [id]: propertyValue });
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

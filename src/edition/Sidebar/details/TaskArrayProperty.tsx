import TaskProperty from './TaskProperty';

interface Props {
  label: string;
  value: string[] | undefined;
  unknown?: boolean;
}

function TaskArrayProperty(props: Props) {
  const { label, value = [], unknown } = props;

  const fallback = unknown ? 'Unknown' : 'None';

  const valueAsStr = value.length > 0 ? value.join(', ') : fallback;

  return <TaskProperty label={label} value={valueAsStr} />;
}
export default TaskArrayProperty;

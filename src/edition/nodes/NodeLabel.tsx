import styles from './NodeLabel.module.css';
import { formatId } from './utils';

interface Props {
  id: string;
  label?: string;
}

function NodeLabel(props: Props) {
  const { id } = props;
  const label = props.label || formatId(id);

  return <div className={styles.content}>{label}</div>;
}

export default NodeLabel;

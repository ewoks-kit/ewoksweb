import styles from './NodeLabel.module.css';
import { formatId } from './utils';

interface Props {
  id: string;
  label?: string;
  showFull?: boolean;
  showCropped?: boolean;
  color?: string;
}

function NodeLabel(props: Props) {
  const { showFull, showCropped, color, id } = props;
  const label = props.label || formatId(id);

  if (!showFull && !showCropped) {
    return null;
  }

  return (
    <div
      className={styles.content}
      style={{
        backgroundColor: color,
      }}
    >
      {showCropped ? label.slice(0, 1) : label}
    </div>
  );
}

export default NodeLabel;

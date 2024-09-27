import { Handle, Position } from 'reactflow';

import styles from './Handle.module.css';

interface Props {
  id?: string;
  position?: Position;
}

function InputHandle(props: Props) {
  const { id = 'tl', position = Position.Left } = props;

  return (
    <Handle
      id={id}
      className={styles.input}
      type="target"
      position={position}
    />
  );
}

export default InputHandle;

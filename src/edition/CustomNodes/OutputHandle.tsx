import { Handle, Position } from 'reactflow';

import styles from './Handle.module.css';

interface Props {
  id?: string;
  position?: Position;
}

function OutputHandle(props: Props) {
  const { id = 'sr', position = Position.Right } = props;

  return (
    <Handle
      id={id}
      className={styles.output}
      type="source"
      position={position}
    />
  );
}

export default OutputHandle;

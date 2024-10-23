import { NodeResizer } from '@xyflow/react';
import type { PropsWithChildren } from 'react';

import styles from './Nodes.module.css';

interface Props {
  className?: string;
  borderColor?: string;
  resizable?: boolean;
}

function NodeWrapper(props: PropsWithChildren<Props>) {
  const {
    className = styles.regularNode,
    borderColor,
    children,
    resizable = false,
  } = props;

  return (
    <div className={className} style={{ borderColor }}>
      <NodeResizer isVisible={resizable} />
      {children}
    </div>
  );
}
export default NodeWrapper;

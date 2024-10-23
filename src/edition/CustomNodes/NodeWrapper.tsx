import type { PropsWithChildren } from 'react';

import styles from './Nodes.module.css';

interface Props {
  className?: string;
  width?: number;
  borderColor?: string;
}

function NodeWrapper(props: PropsWithChildren<Props>) {
  const {
    className = styles.regularNode,
    width = 100,
    borderColor,
    children,
  } = props;

  return (
    <div className={className} style={{ borderColor, width }}>
      {children}
    </div>
  );
}
export default NodeWrapper;

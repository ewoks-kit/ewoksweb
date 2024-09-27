import { Position } from 'reactflow';

import type { SubgraphOutputsInputs } from '../../types';
import styles from './GraphNodeContent.module.css';
import OutputHandle from './OutputHandle';

interface Props {
  output: SubgraphOutputsInputs;
  moreHandles?: boolean;
}

function GraphOutputHandle(props: Props) {
  const { output, moreHandles } = props;

  const shortLabel = output.label.slice(0, output.label.indexOf(':'));

  return (
    <div className={styles.handle}>
      {shortLabel}
      <OutputHandle key={output.label} id={shortLabel} />
      {moreHandles && (
        <OutputHandle
          key={`${output.label} left`}
          id={`${shortLabel} left`}
          position={Position.Left}
        />
      )}
    </div>
  );
}

export default GraphOutputHandle;

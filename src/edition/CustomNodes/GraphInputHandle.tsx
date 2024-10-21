import { Position } from '@xyflow/react';

import type { SubgraphOutputsInputs } from '../../types';
import styles from './GraphNodeContent.module.css';
import InputHandle from './InputHandle';

interface Props {
  input: SubgraphOutputsInputs;
  moreHandles?: boolean;
}

function GraphInputHandle(props: Props) {
  const { input, moreHandles } = props;

  // Remove the rest of the input label for now
  const shortLabel = input.label.slice(0, input.label.indexOf(':'));

  return (
    <div className={styles.handle}>
      {shortLabel}
      <InputHandle key={input.label} id={shortLabel} />
      {moreHandles && (
        <InputHandle
          key={`${input.label} right`}
          id={`${shortLabel} right`}
          position={Position.Right}
        />
      )}
    </div>
  );
}

export default GraphInputHandle;

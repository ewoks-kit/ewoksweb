import type { Connection } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { contentStyle as style } from './NodeStyle';

interface Props {
  label: string;
  isValidConnection: (c: Connection) => boolean;
  moreHandles?: boolean;
}

function InputHandle(props: Props) {
  const { label, moreHandles, isValidConnection } = props;

  const shortLabel = label.slice(0, label.indexOf(':'));

  return (
    <div
      style={{
        ...style.io,
        ...style.textLeft,
        ...(moreHandles ? style.borderInput : {}),
      }}
    >
      {shortLabel}
      <Handle
        type="target"
        position={Position.Left}
        id={shortLabel}
        style={{
          ...style.handle,
          ...style.left,
          ...style.handleTarget,
        }}
        isValidConnection={isValidConnection}
      />
      {moreHandles && (
        <Handle
          type="target"
          position={Position.Right}
          id={`${shortLabel} right`}
          style={{
            ...style.handle,
            ...style.right,
            ...style.handleTarget,
          }}
          isValidConnection={isValidConnection}
        />
      )}
    </div>
  );
}

export default InputHandle;

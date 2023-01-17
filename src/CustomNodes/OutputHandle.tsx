import type { Connection } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { contentStyle as style } from './NodeStyle';

interface Props {
  label: string;
  isValidConnection: (c: Connection) => boolean;
  moreHandles?: boolean;
}

function OutputHandle(props: Props) {
  const { label, moreHandles, isValidConnection } = props;

  const shortLabel = label.slice(0, label.indexOf(':'));

  return (
    <div
      style={{
        ...style.io,
        ...style.textRight,
        ...(moreHandles ? style.borderOutput : {}),
      }}
    >
      {/* remove the rest of the output {output.label} for now */}
      {shortLabel}
      <Handle
        type="source"
        position={Position.Right}
        id={shortLabel}
        style={{
          ...style.handle,
          ...style.right,
          ...style.handleSource,
        }}
        isValidConnection={isValidConnection}
      />
      {moreHandles && (
        <Handle
          type="source"
          position={Position.Left}
          id={`${shortLabel} left`}
          style={{
            ...style.handle,
            ...style.left,
            ...style.handleSource,
          }}
          isValidConnection={isValidConnection}
        />
      )}
    </div>
  );
}

export default OutputHandle;

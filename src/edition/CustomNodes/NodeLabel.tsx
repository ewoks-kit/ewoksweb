import { style } from './nodeStyles';

interface Props {
  label: string;
  showFull?: boolean;
  showCropped?: boolean;
  color?: string;
}

const labelStyle = {
  ...style.title,
  wordWrap: 'break-word' as const,
  margin: '2px',
  padding: '2px',
};

function NodeLabel(props: Props) {
  const { showFull, showCropped, label, color } = props;

  if (!showFull && !showCropped) {
    return null;
  }

  const displayedLabel = showCropped ? label.slice(0, 1) : label;

  return (
    <div
      style={{
        ...labelStyle,
        backgroundColor: color,
        borderRadius: color ? '10px 10px 3px 3px' : '0px',
      }}
    >
      {displayedLabel}
    </div>
  );
}

export default NodeLabel;

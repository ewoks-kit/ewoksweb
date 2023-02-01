import { Background, BackgroundVariant } from 'reactflow';
import useConfigStore from 'store/useConfigStore';

function CanvasBackground() {
  const canvasBackgroundColor = useConfigStore(
    (state) => state.canvasBackgroundColor
  );

  return (
    <Background
      variant={BackgroundVariant.Lines}
      color={canvasBackgroundColor}
      style={{ background: canvasBackgroundColor }}
    />
  );
}

export default CanvasBackground;

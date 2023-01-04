import useConfigStore from '../../../store/useConfigStore';
import type { ChangeEvent } from 'react';

// DOC: Edit the graph style
export default function EditGraphStyle() {
  const setCanvasBackgroundColor = useConfigStore(
    (state) => state.setCanvasBackgroundColor
  );
  const canvasBackgroundColor = useConfigStore(
    (state) => state.canvasBackgroundColor
  );

  const colorLineChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setCanvasBackgroundColor(event.target.value);
  };

  return (
    <div>
      <label id="canvas-background-color-label" htmlFor="head">
        Canvas Background Color
      </label>
      <input
        aria-labelledby="canvas-background-color-label"
        type="color"
        name="head"
        value={canvasBackgroundColor}
        style={{ margin: '10px' }}
        onInput={colorLineChanged}
      />
    </div>
  );
}

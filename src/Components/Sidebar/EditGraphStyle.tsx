import useConfigStore from '../../store/useConfigStore';

// DOC: Edit the graph style
export default function EditGraphStyle() {
  const setCanvasBackgroundColor = useConfigStore(
    (state) => state.setCanvasBackgroundColor
  );
  const canvasBackgroundColor = useConfigStore(
    (state) => state.canvasBackgroundColor
  );

  const colorLineChanged = (event) => {
    setCanvasBackgroundColor(event.target.value);
  };

  return (
    <div>
      <label htmlFor="head">Canvas Background Color</label>
      <input
        aria-label="Color"
        type="color"
        name="head"
        value={canvasBackgroundColor}
        style={{ margin: '10px' }}
        onInput={colorLineChanged}
        data-cy="colorPickerCanvasBackground"
      />
    </div>
  );
}

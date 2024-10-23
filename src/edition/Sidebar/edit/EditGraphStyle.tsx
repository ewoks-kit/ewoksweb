import useConfigStore from '../../../store/useConfigStore';
import ColorPicker from './ColorPicker';

function EditGraphStyle() {
  const setCanvasBackgroundColor = useConfigStore(
    (state) => state.setCanvasBackgroundColor,
  );
  const canvasBackgroundColor = useConfigStore(
    (state) => state.canvasBackgroundColor,
  );

  return (
    <section>
      <ColorPicker
        defaultColorVariable="--canvas-bgColor"
        value={canvasBackgroundColor}
        onChange={setCanvasBackgroundColor}
        label="Canvas Background Color"
      />
    </section>
  );
}

export default EditGraphStyle;

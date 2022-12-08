import { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import type { GraphDetails } from '../../types';

interface EditGraphStyleProps {
  element: GraphDetails;
}
// DOC: Edit the graph style
export default function EditGraphStyle(props: EditGraphStyleProps) {
  const { element } = props;
  const setGraphGeneralConfig = useStore(
    (state) => state.setGraphGeneralConfig
  );
  const [colorCanvas, setColorCanvas] = useState<string>('#e9ebf7');

  useEffect(() => {
    if ('input_nodes' in element) {
      setColorCanvas('#e9ebf7');
    }
  }, [element.id, element]);

  const colorLineChanged = (event) => {
    setColorCanvas(event.target.value);
    setGraphGeneralConfig({
      canvasBackgroundColor: event.target.value,
    });
  };

  return (
    <div>
      <label htmlFor="head">Canvas Background Color</label>
      <input
        aria-label="Color"
        type="color"
        id="head"
        name="head"
        value={colorCanvas}
        onChange={colorLineChanged}
        style={{ margin: '10px' }}
        onInput={colorLineChanged}
        data-cy="colorPickerCanvasBackground"
      />
    </div>
  );
}

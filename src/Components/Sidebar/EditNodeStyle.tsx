import { useEffect, useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';
import type { EwoksRFNode } from '../../types';
import useStore from '../../store/useStore';
import useDebounce from '../../hooks/useDebounce';
import type { ChangeEvent } from 'react';

// DOC: Edit the node style
export default function EditNodeStyle(element: EwoksRFNode) {
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [withImage, setWithImage] = useState<boolean>(false);
  const [withLabel, setWithLabel] = useState<boolean>(false);
  const [colorBorder, setColorBorder] = useState<string>('');
  const [moreHandles, setMoreHandles] = useState<boolean>(true);
  const [nodeSize, setNodeSize] = useState<number>(
    element.data.nodeWidth || 100
  );

  const debouncedNodeWidth = useDebounce(nodeSize, 500);

  useEffect(() => {
    if ('position' in element) {
      setWithImage(element.data.withImage);
      setWithLabel(element.data.withLabel);
      setColorBorder(element.data.colorBorder || '');
      setMoreHandles(!!element.data.moreHandles);
      setNodeSize(element.data.nodeWidth || 100);
    }
    // TODO: Does this specific reference to id needed?
  }, [element]);

  useEffect(
    () => {
      if (debouncedNodeWidth) {
        setElementNodeWidth(debouncedNodeWidth);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedNodeWidth] // Only call effect if debounced search term changes
  );

  function setElementNodeWidth(width) {
    if (debouncedNodeWidth !== element.data.nodeWidth) {
      setSelectedElement(
        {
          ...element,
          data: { ...element.data, nodeWidth: width },
        },
        'fromSaveElement'
      );
    }
  }

  function withImageChanged(event: ChangeEvent<HTMLInputElement>) {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, withImage: event.target.checked },
      },
      'fromSaveElement'
    );
  }

  function withLabelChanged(event: ChangeEvent<HTMLInputElement>) {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, withLabel: event.target.checked },
      },
      'fromSaveElement'
    );
  }

  const colorBorderChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, colorBorder: event.target.value },
      },
      'fromSaveElement'
    );
  };

  const moreHandlesChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          moreHandles: event.target.checked,
        },
      },
      'fromSaveElement'
    );
  };

  const changeNodeSize = (event, number: number) => {
    setNodeSize(number);
  };

  return (
    <FormControl variant="filled" fullWidth>
      {element.task_type !== 'note' && (
        <>
          <div>
            <label htmlFor="withImage">With Image</label>
            <Checkbox
              name="withImage"
              checked={withImage === undefined ? true : !!withImage}
              onChange={withImageChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="withLabel">With Label</label>
            <Checkbox
              name="withLabel"
              checked={withLabel === undefined ? true : !!withLabel}
              onChange={withLabelChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>

          <div>
            <label htmlFor="head">Color</label>
            <input
              aria-label="Color"
              type="color"
              id="head"
              name="head"
              value={colorBorder}
              onChange={colorBorderChanged}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(element.task_type) && (
        <div>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={moreHandles}
              onChange={moreHandlesChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="nodeSize">Node Size</label>
        <Slider
          id="nodeSize"
          color="primary"
          defaultValue={nodeSize}
          value={nodeSize}
          onChange={changeNodeSize}
          min={40}
          max={300}
          style={{ width: '90%' }}
        />
      </div>
    </FormControl>
  );
}

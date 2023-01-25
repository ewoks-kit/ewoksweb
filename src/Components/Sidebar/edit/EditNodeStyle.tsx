import { useEffect, useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';
import type { EwoksRFNode } from '../../../types';
import useStore from '../../../store/useStore';
import useDebounce from '../../../hooks/useDebounce';
import type { ChangeEvent } from 'react';
import { isNode } from 'utils/typeGuards';

// DOC: Edit the node style
export default function EditNodeStyle(element: EwoksRFNode) {
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [nodeSize, setNodeSize] = useState<number>(
    element.data.nodeWidth || 100
  );

  const debouncedNodeWidth = useDebounce(nodeSize, 500);

  useEffect(() => {
    if (!isNode(element)) {
      return;
    }

    setNodeSize(element.data.nodeWidth || 100);
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

  function setElementNodeWidth(width: number) {
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

  const changeNodeSize = (
    _event: ChangeEvent<unknown>,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      setNodeSize(value);
    }
  };

  return (
    <FormControl variant="filled" fullWidth>
      {element.data.task_props.task_type !== 'note' && (
        <>
          <div>
            <label htmlFor="withImage">With Image</label>
            <Checkbox
              name="withImage"
              checked={
                element.data.withImage === undefined
                  ? true
                  : !!element.data.withImage
              }
              onChange={withImageChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="withLabel">With Label</label>
            <Checkbox
              name="withLabel"
              checked={
                element.data.withLabel === undefined
                  ? true
                  : !!element.data.withLabel
              }
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
              value={element.data.colorBorder || ''}
              onChange={colorBorderChanged}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(
        element.data.task_props.task_type
      ) && (
        <div>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={!!element.data.moreHandles}
              onChange={moreHandlesChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      )}
      <div style={{ minWidth: '200px' }}>
        <label htmlFor="nodeSize">Node Size</label>
        <Slider
          id="nodeSize"
          color="primary"
          defaultValue={nodeSize}
          value={nodeSize}
          onChange={changeNodeSize}
          min={40}
          max={300}
          style={{ width: '100%', paddingTop: '45px' }}
          valueLabelDisplay="on"
        />
      </div>
    </FormControl>
  );
}

import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@material-ui/core';

import DashboardStyle from '../../Dashboard/DashboardStyle';
import useStore from '../../../store/useStore';
import type {
  EwoksRFLink,
  GraphRF,
  PropertyChangedEvent,
} from '../../../types';
import sidebarStyle from '../sidebarStyle';
import type { ChangeEvent } from 'react';
import { isLink, isMarkerType, isString } from '../../../utils/typeGuards';
import { MarkerType } from 'reactflow';

const useStyles = DashboardStyle;

// DOC: Edit the link style
export default function EditLinkStyle(element: EwoksRFLink) {
  const classes = useStyles();

  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedElement = useStore((state) => state.selectedElement);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const [linkType, setLinkType] = useState('');
  // const [arrowType, setArrowType] = useState<
  //   { type: MarkerType } | { type: 'none' } | undefined
  // >({
  //   type: MarkerType.Arrow,
  // });
  const [arrowType, setArrowType] = useState<MarkerType | 'none'>(
    MarkerType.Arrow
  );
  const [animated, setAnimated] = useState<boolean>(false);
  const [colorLine, setColorLine] = useState<string>('');
  const [x, setX] = useState(80);
  const [y, setY] = useState(80);

  useEffect(() => {
    if (!isLink(element)) {
      return;
    }

    if (element.type) {
      setLinkType(element.type);
    }

    if (element.type === 'getAround') {
      setX(element.data.getAroundProps?.x || 80);
      setY(element.data.getAroundProps?.y || 80);
    }

    if (!element.markerEnd) {
      setArrowType('none');
    } else {
      setArrowType(
        typeof element.markerEnd !== 'string' ? element.markerEnd.type : 'none'
      );
    }

    setAnimated(!!element.animated);
    setColorLine(element.style?.stroke || '#96a5f9');
  }, [element]);

  function linkTypeChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    if (['multilineText', 'getAround'].includes(val)) {
      setOpenSnackbar({
        open: true,
        text: 'Insert commas (,) in the label to break into multiple lines!',
        severity: 'success',
      });
    }
    setSelectedElement(
      {
        ...element,
        type: val,
      },
      'fromSaveElement'
    );
  }

  const arrowTypeChanged = (event: PropertyChangedEvent) => {
    // 'none' is not available anymore in reactFlow so we
    // need to remove markerEnd if 'none' is selected in dropdown
    const type = event.target.value;
    if (!isString(type)) {
      return;
    }

    if (isMarkerType(type)) {
      setSelectedElement(
        { ...element, markerEnd: { type } },
        'fromSaveElement'
      );
      return;
    }

    setSelectedElement({ ...element, markerEnd: undefined }, 'fromSaveElement');
  };

  const colorLineChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(
      {
        ...element,
        style: { ...element.style, stroke: event.target.value },
        labelStyle: { ...element.labelStyle, fill: event.target.value },
        labelBgStyle: { ...element.labelBgStyle, stroke: event.target.value },
      },
      'fromSaveElement'
    );
  };

  const animatedChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(
      {
        ...element,
        animated: event.target.checked,
      },
      'fromSaveElement'
    );
  };

  function changeX(_event: ChangeEvent<unknown>, value: number | number[]) {
    if (!isLink(selectedElement)) {
      return;
    }
    const newX = value as number;
    setSelectedElement(
      {
        ...selectedElement,
        data: {
          ...selectedElement.data,
          getAroundProps: {
            ...selectedElement.data.getAroundProps,
            x: newX,
          },
        },
      },
      'fromSaveElement'
    );
    setX(newX);
  }

  function changeY(_event: ChangeEvent<unknown>, value: number | number[]) {
    if (!isLink(selectedElement)) {
      return;
    }
    const newY = value as number;
    setSelectedElement(
      {
        ...selectedElement,
        data: {
          ...selectedElement.data,
          getAroundProps: {
            ...selectedElement.data.getAroundProps,
            y: newY,
          },
        },
      },
      'fromSaveElement'
    );
    setY(newY);
  }

  function applyLinkTypeToAll() {
    const newGraph: GraphRF = {
      ...graphRF,
      links: graphRF.links.map((link) => ({ ...link, type: linkType })),
    };
    setGraphRF(newGraph, true);
  }

  function applyArrowTypeToAll() {
    const newGraph: GraphRF = {
      ...graphRF,
      links: graphRF.links.map((link) => {
        if (!arrowType || arrowType === 'none') {
          return { ...link, markerEnd: undefined };
        }
        return { ...link, markerEnd: { type: arrowType } };
      }),
    };
    setGraphRF(newGraph, true);
  }

  return (
    <>
      <FormControl
        variant="filled"
        fullWidth
        style={{ ...sidebarStyle.formstyleflex }}
      >
        <InputLabel id="linkTypeLabel">Link type</InputLabel>
        <Select
          className={classes.styleLinkDropdowns}
          labelId="linkTypeLabel"
          value={linkType ?? 'default'}
          label="Link type"
          onChange={linkTypeChanged}
        >
          {[
            'straight',
            'smoothstep',
            'step',
            'default',
            'bendingText',
            'multilineText',
            'getAround',
          ].map((text) => (
            <MenuItem key={text} value={text}>
              {text}
            </MenuItem>
          ))}
        </Select>
        <Button
          style={{ margin: '8px' }}
          variant="outlined"
          color="primary"
          onClick={applyLinkTypeToAll}
          size="small"
        >
          Apply to all
        </Button>
      </FormControl>
      <FormControl
        variant="filled"
        fullWidth
        style={{ ...sidebarStyle.formstyleflex }}
      >
        <InputLabel id="markerEnd">Arrow Head</InputLabel>
        <Select
          className={classes.styleLinkDropdowns}
          value={arrowType || 'none'}
          label="Arrow head"
          onChange={arrowTypeChanged}
        >
          {[...Object.values(MarkerType), 'none'].map((tex) => (
            <MenuItem value={tex} key={tex}>
              {tex}
            </MenuItem>
          ))}
        </Select>
        <Button
          style={{ margin: '8px' }}
          variant="outlined"
          color="primary"
          onClick={applyArrowTypeToAll}
          size="small"
        >
          Apply to all
        </Button>
      </FormControl>
      <div>
        <label htmlFor="animated">Animated</label>
        <Checkbox
          name="animated"
          checked={animated ?? false}
          onChange={animatedChanged}
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
          value={colorLine}
          onChange={colorLineChanged}
          style={{ margin: '10px' }}
        />
      </div>
      {linkType === 'getAround' && (
        <div>
          Size of Link
          <div>X</div>
          <Slider
            id="slideX"
            color="primary"
            defaultValue={x}
            value={x}
            onChange={changeX}
            min={-200}
            max={200}
            style={{ width: '90%' }}
          />
          <div>Y</div>
          <Slider
            id="slideY"
            color="primary"
            defaultValue={y}
            value={y}
            onChange={changeY}
            min={-200}
            max={200}
            style={{ width: '90%' }}
          />
        </div>
      )}
    </>
  );
}

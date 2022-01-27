import React, { useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import useStore from '../store';
import type { EwoksRFLink, EwoksRFNode } from '../types';

export default function EditElementStyle(propsIn) {
  const { props } = propsIn;
  const { element } = props;

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [nodeType, setNodeType] = React.useState('');
  const [linkType, setLinkType] = React.useState('');
  const [arrowType, setArrowType] = React.useState('');
  const [animated, setAnimated] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(element);
    if ('position' in element) {
      console.log('TODO: handle styling for nodes');
    } else if ('source' in element) {
      setLinkType(element.type);
      setArrowType(element.arrowHeadType);
      setAnimated(element.animated);
    } else {
      console.log('TODO: handle styling for graph');
    }
  }, [element.id, element]);

  const nodeTypeChanged = (event) => {
    setNodeType(event.target.value);
    setSelectedElement({
      ...element,
      data: { ...element.data, type: event.target.value },
    });
  };

  const linkTypeChanged = (event) => {
    setLinkType(event.target.value);
    setSelectedElement({
      ...element,
      type: event.target.value,
    });
  };

  const arrowTypeChanged = (event) => {
    setArrowType(event.target.value);
    setSelectedElement({
      ...element,
      arrowHeadType: event.target.value,
    });
  };

  const animatedChanged = (event) => {
    setAnimated(event.target.checked);
    setSelectedElement({
      ...element,
      animated: event.target.checked,
    });
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          Styling{' '}
          {'position' in selectedElement
            ? 'Node'
            : 'source' in selectedElement
            ? 'Link'
            : 'Graph'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form noValidate autoComplete="off">
          {'position' in selectedElement && (
            <FormControl variant="filled" fullWidth>
              <InputLabel>Node type</InputLabel>
              <Select
                id="demo-simple-select"
                value={nodeType ? nodeType : 'internal'}
                label="Node type"
                onChange={nodeTypeChanged}
              >
                {['input', 'output', 'internal', 'input_output'].map((tex) => (
                  <MenuItem key={tex} value={tex}>
                    {tex}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {'source' in selectedElement && (
            <>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="linkTypeLabel">Link type</InputLabel>
                <Select
                  labelId="linkTypeLabel"
                  value={linkType ? linkType : 'default'}
                  label="Link type"
                  onChange={linkTypeChanged}
                >
                  {['straight', 'smoothstep', 'step', 'default'].map((text) => (
                    <MenuItem key={text} value={text}>
                      {text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="ArrowHeadType">Arrow Head Type</InputLabel>
                <Select
                  value={arrowType ? arrowType : 'arrowclosed'}
                  label="Arrow head"
                  onChange={arrowTypeChanged}
                >
                  {['arrow', 'arrowclosed', 'none'].map((tex) => (
                    <MenuItem value={tex} key={tex}>
                      {tex}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                <b>animated</b>
                <Checkbox
                  checked={animated ? animated : false}
                  onChange={animatedChanged}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </>
          )}
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

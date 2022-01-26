import React, { useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import useStore from '../store';
import type { EwoksRFLink, GraphDetails } from '../types';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import DenseTable from './DenseTable';
import { Box, Button } from '@material-ui/core';
import LinkDetails from './LinkDetails';
import NodeDetails from './NodeDetails';

function EditElement(propsIn) {
  const { props } = propsIn;
  const { element } = props;
  const { on_error } = (element.data && element.data.on_error) || false;
  const { map_all_data } = (element.data && element.data.map_all_data) || false;
  const { setElement } = propsIn;

  const graphRF = useStore((state) => state.graphRF);
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [graphInputs, setGraphInputs] = React.useState<GraphDetails[]>([]);
  const [graphOutputs, setGraphOutputs] = React.useState<GraphDetails[]>([]);

  useEffect(() => {
    console.log(element);
    if ('position' in element) {
      setLabel(
        // TODO: Remove conditional when graphs structure is final
        element.label ? element.label : element.data.label
      );
      setComment(element.data.comment);
    } else if ('source' in element) {
      setLabel(element.label);
      setComment(element.data && element.data.comment);
    } else {
      const selElem = element as GraphDetails;
      setLabel(element.label);
      setComment(element.uiProps && element.uiProps.comment);
      setGraphInputs(selElem.input_nodes ? selElem.input_nodes : []);
      setGraphOutputs(selElem.output_nodes ? selElem.output_nodes : []);
    }
  }, [element.id, element, on_error, map_all_data, setElement]);

  const labelChanged = (event) => {
    setLabel(event.target.value);
    if ('position' in element) {
      const el = element;
      setElement({
        ...el,
        label: event.target.value,
        data: { ...element.data, label: event.target.value },
      });
    } else {
      setElement({
        ...element,
        label: event.target.value,
      });
    }
  };

  const graphCommentChanged = (event) => {
    setComment(event.target.value);
    setElement({
      ...element,
      uiProps: { ...element.uiProps, comment: event.target.value },
    });
  };

  const useConditions = () => {
    console.log(element);
    const el = element as EwoksRFLink;
    const newLabel =
      el.data.conditions.length > 0
        ? el.data.conditions
            .map((con) => con.source_output + ': ' + JSON.stringify(con.value))
            .join(', ')
        : '';
    setLabel(newLabel);
    setElement({
      ...element,
      label: newLabel,
    });
  };

  const useMapping = () => {
    console.log(element);
    const el = element as EwoksRFLink;
    const newLabel =
      el.data.data_mapping.length > 0
        ? el.data.data_mapping
            .map((con) => `${con.source_output}->${con.target_input}`)
            .join(', ')
        : '';
    setLabel(newLabel);
    setElement({
      ...element,
      label: newLabel,
    });
  };

  const commentChanged = (event) => {
    setComment(event.target.value);
    const el = element;
    setElement({
      ...el,
      data: { ...element.data, comment: event.target.value },
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
          Edit{' '}
          {'position' in element
            ? 'Node'
            : 'source' in element
            ? 'Link'
            : 'Graph'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form className="detailsLabels" noValidate autoComplete="off">
          {/* Break graph details 33 lines */}
          {'input_nodes' in element && (
            <>
              <div>
                <b>Id:</b> {graphRF.graph.id}
              </div>
              <div>
                <b>Label:</b> {graphRF.graph.label}
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Label"
                  variant="outlined"
                  value={label || ''}
                  onChange={labelChanged}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Comment"
                  variant="outlined"
                  value={comment || ''}
                  onChange={graphCommentChanged}
                />
              </div>
              <div>
                <b>Inputs </b>
                {graphInputs.length > 0 && <DenseTable data={graphInputs} />}
              </div>
              <div>
                <b>Outputs </b>
                {graphOutputs.length > 0 && <DenseTable data={graphOutputs} />}
              </div>
            </>
          )}
          {/* <div>
            <b>Id:</b> {props.element.id}
          </div> */}
          {'source' in element && (
            <LinkDetails
              props={{
                ...props,
              }}
              setElement={setElement}
            />
          )}
          {'position' in element && (
            <NodeDetails
              props={{
                ...props,
              }}
              setElement={setElement}
            />
          )}
          {/* Break label comment 60 lines */}
          {(Object.keys(element).includes('position') ||
            Object.keys(element).includes('source')) && (
            <>
              <div>
                <Box>
                  {Object.keys(element).includes('source') && (
                    <Tooltip
                      title="Use conditions or data-mapping as label"
                      arrow
                    >
                      <span>
                        <Button
                          style={{ margin: '8px' }}
                          variant="contained"
                          color="primary"
                          onClick={useConditions}
                          size="small"
                        >
                          conditions
                        </Button>
                        <Button
                          style={{ margin: '8px' }}
                          variant="contained"
                          color="primary"
                          onClick={useMapping}
                          size="small"
                        >
                          mapping
                        </Button>
                      </span>
                    </Tooltip>
                  )}

                  {/* if text size big use a text area
                  <TextareaAutosize
                    aria-label="empty textarea"
                    placeholder="Empty"
                    style={{ width: 200 }}
                    value={label || ''}
                    onChange={labelChanged}
                  /> */}
                  <TextField
                    id="outlined-basic"
                    label="Label"
                    variant="outlined"
                    value={label || ''}
                    onChange={labelChanged}
                  />
                </Box>
              </div>
              <div>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Comment"
                    variant="outlined"
                    value={comment || ''}
                    onChange={commentChanged}
                  />
                </Box>
              </div>
            </>
          )}
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

export default EditElement;

import React, { useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import useStore from '../store';
import axios from 'axios';
import type {
  DataMapping,
  EwoksRFLink,
  EwoksRFNode,
  GraphDetails,
  Inputs,
} from '../types';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DenseTable from './DenseTable';
import { Box, Button, Checkbox, IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import EditIcon from '@material-ui/icons/EditOutlined';
import EditTaskProp from './EditTaskProp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1, 0),
        wordBreak: 'break-word',
        // width: '25ch',
      },
    },

    iconBut: {
      padding: '2px',
    },

    formInfo: {
      width: '200px',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
    },
  })
);

function EditElement(propsIn) {
  const classes = useStyles();
  const { props } = propsIn;
  const { element } = props;
  const { on_error } = (element.data && element.data.on_error) || false;
  const { map_all_data } = (element.data && element.data.map_all_data) || false;
  const { setElement } = propsIn;
  console.log(props);

  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const graphRF = useStore((state) => state.graphRF);
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [graphInputs, setGraphInputs] = React.useState<GraphDetails[]>([]);
  const [graphOutputs, setGraphOutputs] = React.useState<GraphDetails[]>([]);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);
  const [elementL, setElementL] = React.useState<EwoksRFLink>(
    {} as EwoksRFLink
  );
  const [dataMapping, setDataMapping] = React.useState<DataMapping[]>([]);
  const [onError, setOnError] = React.useState<boolean>(false);
  const [conditions, setConditions] = React.useState<Inputs[]>([]);
  const [editProps, setEditProps] = React.useState<boolean>(false);
  const [defaultInputs, setDefaultInputs] = React.useState<Inputs[]>([]);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [moreHandles, setMoreHandles] = React.useState<boolean>(true);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const taskProperties = [
    {
      id: 'task_identifier',
      label: 'Identifier',
      value: props.element.task_identifier,
    },
    { id: 'task_type', label: 'Type', value: props.element.task_type },
    {
      id: 'task_generator',
      label: 'Generator',
      value: props.element.task_generator,
    },
    { id: 'task_icon', label: 'Icon', value: props.element.icon },
    { id: 'task_category', label: 'Category', value: props.element.categoty },
    {
      id: 'optional_input_names',
      label: 'Optional Inputs',
      value: props.element.optional_input_names,
    },
    {
      id: 'required_input_names',
      label: 'Required Inputs',
      value: props.element.required_input_names,
    },
    {
      id: 'output_names',
      label: 'Outputs',
      value: props.element.output_names,
    },
  ];

  useEffect(() => {
    // setElement(selectedElement);
    console.log(element);
    if ('position' in element) {
      // setElementN(selectedElement);
      setLabel(
        element.label ? element.label : element.data.label // Remove when graphs ok
      );
      setComment(element.data.comment);
      setInputsComplete(!!element.inputs_complete);
      setMoreHandles(!!element.data.moreHandles);
      setDefaultInputs(element.default_inputs ? element.default_inputs : []);
    } else if ('source' in element) {
      setElementL(element);
      setLabel(element.label);
      setComment(element.data && element.data.comment);
      if (element.data && element.data.data_mapping) {
        setDataMapping(element.data.data_mapping);
      }

      setMapAllData(!!element.data.map_all_data || false);

      setOnError(!!element.data.on_error || false);

      if (element.data && element.data.conditions) {
        setConditions(element.data.conditions);
      }
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

  const mapAllDataChanged = (event) => {
    setMapAllData(event.target.checked);
    setElement({
      ...(element as EwoksRFLink),
      data: { ...element.data, map_all_data: event.target.checked },
    });
    setSelectedElement({
      ...(element as EwoksRFLink),
      data: { ...element.data, map_all_data: event.target.checked },
    });
  };

  const addDataMapping = () => {
    const el = element as EwoksRFLink;
    const elMap = el.data.data_mapping;
    if (elMap && elMap[elMap.length - 1] && elMap[elMap.length - 1].id === '') {
      console.log('should not ADD mapping');
    } else {
      setElement({
        ...el,
        data: {
          ...el.data,
          data_mapping: [...elMap, { id: '', name: '', value: '' }],
        },
      });
      setSelectedElement({
        ...el,
        data: {
          ...el.data,
          data_mapping: [...elMap, { id: '', name: '', value: '' }],
        },
      });
    }
  };

  const dataMappingValuesChanged = (table) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value,
      };
    });
    setSelectedElement({
      ...(element as EwoksRFLink),
      data: {
        ...element.data,
        data_mapping: dmap,
        label: dmap
          .map((el) => `${el.source_output}->${el.target_input}`)
          .join(', '),
      },
    });
    // setElement({
    //   ...(element as EwoksRFLink),
    //   data: {
    //     ...element.data,
    //     data_mapping: dmap,
    //     label: dmap
    //       .map((el) => `${el.source_output}->${el.target_input}`)
    //       .join(', '),
    //   },
    // });
  };

  const onErrorChanged = (event) => {
    setOnError(event.target.checked);
    setSelectedElement({
      ...(element as EwoksRFLink),
      data: { ...element.data, on_error: event.target.checked },
    });
  };

  const addConditions = () => {
    const el = element as EwoksRFLink;
    const elCon = el.data.conditions;
    if (elCon && elCon[elCon.length - 1] && elCon[elCon.length - 1].id === '') {
      console.log('should not ADD condition');
    } else {
      setSelectedElement({
        ...el,
        data: {
          ...element.data,
          on_error: false,
          conditions: [...elCon, { id: '', name: '', value: '' }],
        },
      });
    }
  };

  const conditionsValuesChanged = (table) => {
    // setElement({
    //   ...(element as EwoksRFLink),
    //   data: {
    //     ...element.data,
    //     conditions: table.map((con) => {
    //       return {
    //         source_output: con.name,
    //         value: con.value,
    //       };
    //     }),
    //   },
    // });
    setSelectedElement({
      ...element,
      data: {
        ...element.data,
        conditions: table.map((con1) => {
          return {
            source_output: con1.name,
            value: con1.value,
          };
        }),
      },
    });
  };

  const addDefaultInputs = () => {
    const el = element as EwoksRFNode;
    const elIn = el.default_inputs;
    if (elIn && elIn[elIn.length - 1] && elIn[elIn.length - 1].id === '') {
      console.log('should not ADD default');
    } else {
      setSelectedElement({
        ...element,
        default_inputs: [...elIn, { id: '', name: '', value: '' }],
      });
    }
  };

  const propChanged = (propKeyValue) => {
    // setTaskIdentifier(event.target.value);
    setElement({
      ...element,
      ...propKeyValue,
    });
  };

  const defaultInputsChanged = (table) => {
    // setDefaultInputs(table);
    // TODO: here setSelectedElement is not needed examine...
    setElement({
      ...element,
      default_inputs: table.map((dval) => {
        return {
          id: dval.name,
          name: dval.name,
          value: dval.value,
        };
      }),
    });
  };

  const inputsCompleteChanged = (event) => {
    setInputsComplete(event.target.checked);
    setElement({
      ...element,
      inputs_complete: event.target.checked,
    });
  };

  const moreHandlesChanged = (event) => {
    setMoreHandles(event.target.checked);
    setElement({
      ...(element as EwoksRFNode),
      data: { ...element.data, moreHandles: event.target.checked },
    });
    // Remove when refresh is resolved
    setOpenSnackbar({
      open: true,
      text: `Please save and reload the graph before using the new handles`,
      severity: 'warning',
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
        <form className={classes.root} noValidate autoComplete="off">
          {/* {'id' in element ? ( */}
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
          {/* : ( */}
          <div>
            <b>Id:</b> {props.element.id}
          </div>
          {/* )} */}
          {'source' in element && (
            <>
              <div className={classes.root}>
                <b>Source:</b> {props.element.source}
              </div>
              <div className={classes.root}>
                <b>Target:</b> {props.element.target}
              </div>
              {props.element.sub_target && (
                <div className={classes.root}>
                  <b>Sub_target:</b> {props.element.data.sub_target}
                </div>
              )}
              {props.element.sub_target_attributes && (
                <div className={classes.root}>
                  <b>Sub_target_attributes:</b>
                  {props.element.data.sub_target_attributes}
                </div>
              )}
              <div>
                <b>Map all Data</b>
                <Checkbox
                  checked={mapAllData}
                  onChange={mapAllDataChanged}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
              {!mapAllData && elementL.source && (
                <div>
                  <b>Data Mapping </b>
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addDataMapping()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {dataMapping.length > 0 && (
                    <EditableTable
                      headers={['Source', 'Target']}
                      defaultValues={dataMapping}
                      valuesChanged={dataMappingValuesChanged}
                      typeOfValues={[
                        {
                          type: elementL.source
                            ? ['class'].includes(
                                graphRF &&
                                  graphRF.nodes[0] &&
                                  graphRF.nodes.find((nod) => {
                                    return nod.id === elementL.source;
                                  }).task_type
                              )
                              ? 'select'
                              : 'input'
                            : 'input',
                          values: props.element.data.links_input_names || [],
                        },
                        {
                          type: elementL.target
                            ? ['class'].includes(
                                graphRF &&
                                  graphRF.nodes[0] &&
                                  graphRF.nodes.find((nod) => {
                                    return nod.id === elementL.target;
                                  }).task_type
                              )
                              ? 'select'
                              : 'input'
                            : 'input',
                          values:
                            [
                              ...props.element.data.links_required_output_names,
                              ...props.element.data.links_optional_output_names,
                            ] || [],
                        },
                      ]}
                    />
                  )}
                </div>
              )}
              <div>
                <b>on_error</b>
                <Checkbox
                  checked={onError}
                  onChange={onErrorChanged}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
              {!onError && elementL.source && (
                <div>
                  <b>Conditions </b>
                  {/* TODO: any kind of type is allowed: objects, arrays that need to be editable */}
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addConditions()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {conditions && conditions.length > 0 && (
                    <EditableTable
                      headers={['Source_output', 'Value']}
                      defaultValues={conditions}
                      valuesChanged={conditionsValuesChanged}
                      typeOfValues={[
                        {
                          type: elementL.source
                            ? ['class'].includes(
                                graphRF &&
                                  graphRF.nodes[0] &&
                                  graphRF.nodes.find((nod) => {
                                    return nod.id === elementL.source;
                                  }).task_type
                              )
                              ? 'select'
                              : 'input'
                            : 'input',
                          values: props.element.data.links_input_names || [],
                        },
                        {
                          type: 'input',
                        },
                      ]}
                    />
                  )}
                </div>
              )}

              <hr />
            </>
          )}
          {'position' in element && (
            <>
              <IconButton
                style={{ padding: '0px' }}
                aria-label="edit"
                onClick={() => {
                  setEditProps(!editProps);
                }}
              >
                <EditIcon />
              </IconButton>
              <Box>
                {taskProperties.map(({ id, label, value }) => (
                  <EditTaskProp
                    key={id}
                    id={id}
                    label={label}
                    value={value}
                    propChanged={propChanged}
                    editProps={editProps}
                  />
                ))}
                <div>
                  <hr />
                  <b>Default Values </b>
                  {/* TODO: any kind of type is allowed: objects, arrays that need to be editable */}
                  <IconButton
                    style={{ padding: '1px' }}
                    aria-label="delete"
                    onClick={() => addDefaultInputs()}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {defaultInputs.length > 0 && (
                    <EditableTable
                      headers={['Name', 'Value']}
                      defaultValues={defaultInputs}
                      valuesChanged={defaultInputsChanged}
                      typeOfValues={[{ type: 'input' }, { type: 'input' }]}
                    />
                  )}
                </div>
                <hr />
                <div>
                  <b>Inputs-complete</b>
                  <Checkbox
                    checked={inputsComplete}
                    onChange={inputsCompleteChanged}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
                {!['graphInput', 'graphOutput', 'graph'].includes(
                  element.task_type
                ) && (
                  <div>
                    <div>
                      <b>More handles</b>
                      <Checkbox
                        checked={moreHandles}
                        onChange={moreHandlesChanged}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </div>
                  </div>
                )}
              </Box>
            </>
          )}
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

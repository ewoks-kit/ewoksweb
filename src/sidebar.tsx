import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useStore from './store';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import orange1 from './images/orange1.png';
import orange2 from './images/orange2.png';
import orange3 from './images/orange3.png';
import AggregateColumns from './images/AggregateColumns.svg';
import Continuize from './images/Continuize.svg';
import graphInput from './images/graphInput.svg';
import graphOutput from './images/graphOutput.svg';
import Correlations from './images/Correlations.svg';
import CreateClass from './images/CreateClass.svg';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import EditableTable from './Components/EditableTable';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Upload from './Components/Upload';
import AddIcon from '@material-ui/icons/Add';
import DraggableDialog from './Components/DraggableDialog';
import DenseTable from './Components/DenseTable';
import EditIcon from '@material-ui/icons/EditOutlined';
import SaveIcon from '@material-ui/icons/Save';
import IconMenu from './Components/IconMenu';
import Drawer from './Components/Drawer';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
// import TextSnippetIcon from '@material-ui/icons/TextSnippet';
import TextsmsIcon from '@material-ui/icons/Textsms';

import type {
  EwoksRFNode,
  EwoksRFLink,
  Inputs,
  GraphDetails,
  Task,
  DataMapping,
  GraphRF,
} from './types';
import { rfToEwoks } from './utils';
import EditTaskProp from './Components/EditTaskProp';

const onDragStart = (event, { task_identifier, task_type, icon }) => {
  event.dataTransfer.setData('task_identifier', task_identifier);
  event.dataTransfer.setData('task_type', task_type);
  event.dataTransfer.setData('icon', icon);
  event.dataTransfer.effectAllowed = 'move';
};

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

const iconsObj = {
  orange1,
  Continuize,
  graphInput,
  graphOutput,
  orange2,
  orange3,
  AggregateColumns,
  Correlations,
  CreateClass,
  // TextSnippetIcon,
  TextsmsIcon,
};

export default function Sidebar(props) {
  const classes = useStyles();

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  const [defaultInputs, setDefaultInputs] = React.useState<Inputs[]>([]);
  const [dataMapping, setDataMapping] = React.useState<DataMapping[]>([]);
  const [conditions, setConditions] = React.useState<Inputs[]>([]);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [moreHandles, setMoreHandles] = React.useState<boolean>(true);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);
  const [conditionsAsLabel, setconditionsAsLabel] = React.useState<boolean>(
    false
  );
  const [mappingAsLabel, setMappingAsLabel] = React.useState<boolean>(false);
  const [nodeType, setNodeType] = React.useState('');
  const [linkType, setLinkType] = React.useState('');
  const [arrowType, setArrowType] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [element, setElement] = React.useState<EwoksRFNode | EwoksRFLink>(
    {} as EwoksRFNode | EwoksRFLink
  );
  // used only for typescript functioning???
  // const [setElementN] = React.useState<EwoksRFNode>(
  //   {} as EwoksRFNode
  // );
  const [elementL, setElementL] = React.useState<EwoksRFLink>(
    {} as EwoksRFLink
  );
  const [onError, setOnError] = React.useState<boolean>(false);
  const [animated, setAnimated] = React.useState<boolean>(false);
  const [graphInputs, setGraphInputs] = React.useState<GraphDetails[]>([]);
  const [graphOutputs, setGraphOutputs] = React.useState<GraphDetails[]>([]);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState({});
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const [editProps, setEditProps] = React.useState<boolean>(false);
  const initializedGraph = useStore((state) => state.initializedGraph);

  useEffect(() => {
    setElement(selectedElement);

    if ('position' in selectedElement) {
      // setElementN(selectedElement);
      setNodeType(selectedElement.data.type);
      setLabel(
        selectedElement.label
          ? selectedElement.label
          : selectedElement.data.label // Remove when graphs ok
      );
      setComment(selectedElement.data.comment);
      setInputsComplete(!!selectedElement.inputs_complete);
      setMoreHandles(!!selectedElement.data.moreHandles);
      setDefaultInputs(
        selectedElement.default_inputs ? selectedElement.default_inputs : []
      );
    } else if ('source' in selectedElement) {
      setElementL(selectedElement);
      setLinkType(selectedElement.type);
      setArrowType(selectedElement.arrowHeadType);
      setAnimated(selectedElement.animated);
      setLabel(selectedElement.label);
      setComment(selectedElement.data && selectedElement.data.comment);
      if (selectedElement.data && selectedElement.data.data_mapping) {
        setDataMapping(selectedElement.data.data_mapping);
      }
      // if (selectedElement.data && selectedElement.data.map_all_data)
      setMapAllData(!!selectedElement.data.map_all_data || false);
      // if (selectedElement.data && selectedElement.data.on_error)
      setOnError(!!selectedElement.data.on_error || false);
      if (selectedElement.data && selectedElement.data.conditions) {
        setConditions(selectedElement.data.conditions);
      }
    } else {
      const selElem = selectedElement as GraphDetails;
      setLabel(selectedElement.label);
      setComment(selectedElement.uiProps && selectedElement.uiProps.comment);
      setGraphInputs(selElem.input_nodes ? selElem.input_nodes : []);
      setGraphOutputs(selElem.output_nodes ? selElem.output_nodes : []);
    }
  }, [
    selectedElement.id,
    selectedElement,
    graphRF.graph.input_nodes,
    graphRF.graph.output_nodes,
    graphRF.graph.label,
    graphRF.graph.uiProps,
  ]);

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

  const propChanged = (propKeyValue) => {
    // setTaskIdentifier(event.target.value);
    setElement({
      ...element,
      ...propKeyValue,
    });
  };

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

  const useConditions = () => {
    console.log(element);
    const el = element as EwoksRFLink;
    const newLabel =
      el.data.conditions.length > 0
        ? el.data.conditions
            .map((con) => con.source_output + ': ' + con.value)
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
            .map((con) => con.target_input + '->' + con.source_output)
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

  const graphCommentChanged = (event) => {
    setComment(event.target.value);
    setElement({
      ...element,
      uiProps: { ...element.uiProps, comment: event.target.value },
    });
  };

  const nodeTypeChanged = (event) => {
    setNodeType(event.target.value);
    setElement({
      ...element,
      data: { ...element.data, type: event.target.value },
    });
  };

  const linkTypeChanged = (event) => {
    setLinkType(event.target.value);
    setElement({
      ...element,
      type: event.target.value,
    });
  };

  const arrowTypeChanged = (event) => {
    setArrowType(event.target.value);
    setElement({
      ...element,
      arrowHeadType: event.target.value,
    });
  };

  const defaultInputsChanged = (table) => {
    // setDefaultInputs(table);
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

  const conditionsValuesChanged = (table) => {
    setElement({
      ...(element as EwoksRFLink),
      data: {
        ...element.data,
        conditions: table.map((con) => {
          return {
            source_output: con.name,
            value: con.value,
          };
        }),
      },
    });
  };

  const dataMappingValuesChanged = (table) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value,
      };
    });
    setElement({
      ...(element as EwoksRFLink),
      data: {
        ...element.data,
        data_mapping: dmap,
        label: dmap
          .map((el) => `${el.source_output}->${el.target_input}`)
          .join(', '),
      },
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

  const inputsCompleteChanged = (event) => {
    setInputsComplete(event.target.checked);
    setElement({
      ...element,
      inputs_complete: event.target.checked,
    });
  };

  const onErrorChanged = (event) => {
    setOnError(event.target.checked);
    setElement({
      ...(element as EwoksRFLink),
      data: { ...element.data, on_error: event.target.checked },
    });
  };

  const animatedChanged = (event) => {
    setAnimated(event.target.checked);
    setElement({
      ...element,
      animated: event.target.checked,
    });
  };

  const mapAllDataChanged = (event) => {
    setMapAllData(event.target.checked);
    setElement({
      ...element,
      data: { ...element.data, map_all_data: event.target.checked },
    });
  };

  const saveElement = () => {
    // TODO: if in save some links dont have active source-target should be deleted?
    // calculate effects on saving an element on the rest of the graph
    setSelectedElement(element, 'fromSaveElement');
  };

  const deleteElement = async () => {
    // TODO: if node deleted all associated links should be deleted with warning?
    let newGraph = {};
    const elN = element as EwoksRFNode; // is this the way???
    const elL = element as EwoksRFLink;
    const elD = element as GraphDetails;
    if (elN.position) {
      // find associated links to delete
      const nodesLinks = graphRF.links.filter(
        (link) => !(link.source === elN.id || link.target === elN.id)
      );
      newGraph = {
        ...graphRF,
        nodes: graphRF.nodes.filter((nod) => nod.id !== element.id),
        links: nodesLinks,
      };
    } else if (elL.source) {
      newGraph = {
        ...graphRF,
        links: graphRF.links.filter((link) => link.id !== elL.id),
      };
    }

    if (elD.input_nodes) {
      await axios
        .delete(`http://localhost:5000/workflow/${elD.id}`)
        .then(() => {
          setOpenSnackbar({
            open: true,
            text: `Workflow ${elD.id} succesfully deleted!`,
            severity: 'success',
          });
        })
        .catch((error) => {
          setOpenSnackbar({
            open: true,
            text: error.message,
            severity: 'error',
          });
        });
      setGraphRF(initializedGraph);
      setSelectedElement({} as GraphDetails);
      setSubgraphsStack({ id: 'initialiase', label: '' });
      setRecentGraphs({} as GraphRF, true);
    } else {
      if (workingGraph.graph.id === graphRF.graph.id) {
        setGraphRF(newGraph as GraphRF);
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Not allowed to delete any element in a sub-graph!',
          severity: 'success',
        });
      }
    }
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
          conditions: [...elCon, { id: '', name: '', value: '' }],
        },
      });
    }
  };

  const addDataMapping = () => {
    const el = element as EwoksRFLink;
    const elMap = el.data.data_mapping;
    if (elMap && elMap[elMap.length - 1] && elMap[elMap.length - 1].id === '') {
      console.log('should not ADD mapping');
    } else {
      setSelectedElement({
        ...el,
        data: {
          ...el.data,
          data_mapping: [...elMap, { id: '', name: '', value: '' }],
        },
      });
    }
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

  const insertGraph = () => {
    setGraphOrSubgraph(false);
  };

  const showEwoksGraph = () => {
    setOpenDialog(true);
    setDialogContent({
      title: 'Ewoks Graph',
      object: rfToEwoks(graphRF),
      openFrom: 'sidebar',
    });
  };

  const getTasks = async () => {
    const tasks = await axios.get('http://localhost:5000/tasks');
    setTasks(tasks.data as Task[]);
  };

  return (
    <aside className="dndflow">
      <Accordion
        onChange={(e, expanded) => {
          if (expanded) {
            getTasks();
          }
        }}
      >
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Add Nodes</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {tasks.map((elem) => (
            <span
              role="button"
              tabIndex={0}
              key={elem.task_identifier}
              className="dndnode"
              onDragStart={(event) =>
                onDragStart(event, {
                  task_identifier: elem.task_identifier,
                  task_type: elem.task_type,
                  icon: elem.icon,
                })
              }
              draggable
            >
              <Tooltip title={elem.task_identifier}>
                <img
                  src={
                    Object.keys(iconsObj).includes(elem.icon)
                      ? iconsObj[elem.icon]
                      : iconsObj['orange1']
                  }
                  alt=""
                />
              </Tooltip>
            </span>
          ))}
          <span
            role="button"
            tabIndex={0}
            key="addNote"
            className="dndnode"
            onDragStart={(event) =>
              onDragStart(event, {
                task_identifier: 'note',
                task_type: 'note',
                icon: iconsObj['TextsmsIcon'],
              })
            }
            draggable
          >
            <Tooltip title="add note">
              <TextsmsIcon fontSize="large" />
            </Tooltip>
          </span>
          <Upload>
            <span role="button" tabIndex={0} onClick={insertGraph}>
              <AddIcon />G
            </span>
          </Upload>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Edit{' '}
            {'position' in selectedElement
              ? 'Node'
              : 'source' in selectedElement
              ? 'Link'
              : 'Graph'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form className={classes.root} noValidate autoComplete="off">
            {/* {'id' in selectedElement ? ( */}
            {'input_nodes' in selectedElement && (
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
                  {graphOutputs.length > 0 && (
                    <DenseTable data={graphOutputs} />
                  )}
                </div>
              </>
            )}
            {/* : ( */}
            <div>
              <b>Id:</b> {props.element.id}
            </div>
            {/* )} */}
            {'source' in selectedElement && (
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
                                ...props.element.data
                                  .links_required_output_names,
                                ...props.element.data
                                  .links_optional_output_names,
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
            {'position' in selectedElement && (
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
                    selectedElement.task_type
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
            {(Object.keys(selectedElement).includes('position') ||
              Object.keys(selectedElement).includes('source')) && (
              <>
                <div>
                  <Box>
                    {Object.keys(selectedElement).includes('source') && (
                      <Tooltip title="Use conditions or data-mapping as label">
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
          <form className={classes.root} noValidate autoComplete="off">
            {'position' in selectedElement && (
              <FormControl variant="filled" fullWidth>
                <InputLabel>Node type</InputLabel>
                <Select
                  id="demo-simple-select"
                  value={nodeType ? nodeType : 'internal'}
                  label="Node type"
                  onChange={nodeTypeChanged}
                >
                  {['input', 'output', 'internal', 'input_output'].map(
                    (tex) => (
                      <MenuItem key={tex} value={tex}>
                        {tex}
                      </MenuItem>
                    )
                  )}
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
                    {['straight', 'smoothstep', 'step', 'default'].map(
                      (text) => (
                        <MenuItem key={text} value={text}>
                          {text}
                        </MenuItem>
                      )
                    )}
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
      <Button
        style={{ margin: '8px' }}
        variant="contained"
        color="primary"
        onClick={saveElement}
        size="small"
      >
        <SaveIcon />
      </Button>
      {/* {!('input_nodes' in selectedElement) && ( */}
      <Button
        style={{ margin: '8px' }}
        variant="outlined"
        color="secondary"
        onClick={deleteElement}
        size="small"
      >
        Delete
      </Button>
      {/* )} */}
      {!('source' in selectedElement) && (
        <IconMenu handleShowEwoksGraph={showEwoksGraph} />
      )}
      <DraggableDialog
        open={openDialog}
        content={dialogContent}
        setValue={defaultInputsChanged}
      />
      <Drawer />
    </aside>
  );
}

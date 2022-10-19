import React, { useEffect } from 'react';

import type { DataMapping, EwoksRFNode } from '../types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
// import EditIcon from '@material-ui/icons/EditOutlined'; DONT DELETE
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import EditTaskProp from './EditTaskProp';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import SidebarTooltip from './SidebarTooltip';
import { OpenInBrowser } from '@material-ui/icons';
import LabelComment from './LabelComment';
import DefaultInputs from './DefaultInputs';

const useStyles = DashboardStyle;

// selectedNode details in sidebar
// Test
// unit: fake some TaskProperties and check the form
//       click and edit some properties and check the node properties
// integration: by setting a selected node and validating the form and chenge values to see
//             the selected node change
export default function NodeDetails(props: { element: EwoksRFNode }) {
  const classes = useStyles();

  const { element } = props;

  const setSelectedElement = state((state) => state.setSelectedElement);
  // const selectedElement = state((state) => state.selectedElement);
  // const [editProps, setEditProps] = React.useState<boolean>(false);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [advanced, setAdvanced] = React.useState<boolean>(false);
  const [defaultErrorNode, setDefaultErrorNode] = React.useState<boolean>(
    false
  );

  const [dataMapping, setDataMapping] = React.useState<DataMapping[]>([]);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);

  const NonEditableTaskProperties = [
    // { id: 'id', label: 'Id', value: props.element.id },
    // { id: 'task_icon', label: 'Icon', value: props.element.task_icon },
    {
      id: 'task_category',
      label: 'Category',
      value: props.element.task_category,
    },
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
  ];

  useEffect(() => {
    // console.log(element);
    setInputsComplete(!!element.inputs_complete);
    setDefaultErrorNode(element.default_error_node || false);
    // setDefaultErrorAttributes(element.default_error_attributes);
    setDataMapping(element.default_error_attributes?.data_mapping);
    setMapAllData(element.default_error_attributes?.map_all_data || false);
  }, [element.id, element]);

  function propChanged(propKeyValue: {}) {
    console.log(propKeyValue);
    setSelectedElement({
      ...element,
      ...propKeyValue,
    });
  }

  const inputsCompleteChanged = (event) => {
    setSelectedElement(
      {
        ...element,
        inputs_complete: event.target.checked,
      },
      'fromSaveElement'
    );
  };

  const advancedChanged = (event) => {
    setAdvanced(event.target.checked);
  };

  const defaulErrortNodeChanged = (event) => {
    setSelectedElement(
      {
        ...element,
        default_error_node: event.target.checked,
      },
      'fromSaveElement'
    );
  };

  const addDataMapping = () => {
    const el = element as EwoksRFNode;
    const elMap = el.default_error_attributes.data_mapping || [];
    if (elMap && elMap[elMap.length - 1] && elMap[elMap.length - 1].id === '') {
      // console.log('should not ADD mapping');
    } else {
      setSelectedElement(
        {
          ...el,
          default_error_attributes: {
            ...el.default_error_attributes,
            data_mapping: [...elMap, { id: '', name: '', value: '' }],
          },
        },
        'fromSaveElement'
      );
    }
  };

  const dataMappingValuesChanged = (table) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value,
      };
    });
    setSelectedElement(
      {
        ...(element as EwoksRFNode),
        default_error_attributes: {
          ...element.default_error_attributes,
          data_mapping: dmap,
        },
      },
      'fromSaveElement'
    );
  };

  const mapAllDataChanged = (event) => {
    setSelectedElement(
      {
        ...element,
        default_error_attributes: {
          ...element.default_error_attributes,
          map_all_data: event.target.checked,
        },
      },
      'fromSaveElement'
    );
  };

  return (
    <Box>
      <Paper
        style={{
          backgroundColor: '#e9ebf7',
          borderRadius: '10px 0px 0px 10px',
          // minWidth: '273px',
          border: '#96a5f9',
          borderStyle: 'solid none solid solid',
          padding: '4px',
          marginBottom: '10px',
        }}
      >
        <LabelComment element={element} showComment={advanced} />
        <DefaultInputs element={element} />

        <hr style={{ color: '#96a5f9' }} />
        <div>
          <b>Advanced</b>
          <Checkbox
            checked={advanced}
            onChange={advancedChanged}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
        <SidebarTooltip
          text={`Set to True when the default input covers all required input
        (used for method and script as the required inputs are unknown).`}
        >
          <div style={{ display: advanced ? 'block' : 'none' }}>
            <b>Inputs-complete</b>
            <Checkbox
              checked={inputsComplete}
              onChange={inputsCompleteChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </SidebarTooltip>
        <hr
          style={{ color: '#96a5f9', display: advanced ? 'block' : 'none' }}
        />
        <SidebarTooltip
          text={`When set to True all nodes without error handler
        will be linked to this node. ONLY for one node in its graph`}
        >
          <div style={{ display: advanced ? 'block' : 'none' }}>
            <b>Default Error Node</b>
            <Checkbox
              checked={defaultErrorNode}
              onChange={defaulErrortNodeChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </SidebarTooltip>
        {defaultErrorNode && advanced && (
          <div>
            <b>Map all Data</b>
            <Checkbox
              checked={mapAllData}
              onChange={mapAllDataChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        )}
        {defaultErrorNode && !mapAllData && advanced && (
          <div>
            {/* TODO: Replace Data Mapping with the component to have dropdowns if not rarely used */}
            {/* <DataMappingComponent element={element} /> */}
            <b>Data Mapping </b>
            <IconButton
              style={{ padding: '1px' }}
              aria-label="delete"
              onClick={() => addDataMapping()}
            >
              <AddCircleOutlineIcon />
            </IconButton>
            {dataMapping && dataMapping.length > 0 && (
              <EditableTable
                headers={['Source', 'Target']}
                defaultValues={dataMapping}
                valuesChanged={dataMappingValuesChanged}
                typeOfValues={[
                  {
                    type: 'input',
                    values: [],
                  },
                  {
                    type: 'input',
                    values: [],
                  },
                ]}
              />
            )}
          </div>
        )}
      </Paper>

      <SidebarTooltip
        text={`These properties are being populated by the task the
        specific node is based on. If you need to have them create a new Task
        with the appropriete properties and use it.`}
      >
        <Accordion
          style={{ display: advanced ? 'block' : 'none' }}
          id="Accordions-sidebar"
        >
          <AccordionSummary
            expandIcon={<OpenInBrowser />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Node Info</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {taskProperties.map(({ id, label, value }) => (
                <EditTaskProp
                  key={id}
                  id={id}
                  label={label}
                  value={value}
                  propChanged={propChanged}
                  editProps // editProps
                />
              ))}
              {NonEditableTaskProperties.map(({ id, label, value }) => (
                <div key={id} className={classes.detailsLabels}>
                  <b>{label}:</b>{' '}
                  {typeof value === 'object' ? value.join(', ') : value}
                </div>
              ))}
              {/* DONT DELETE: Use later if we need to edit node details in EditTaskProp */}
              {/* <IconButton
        style={{ padding: '0px' }}
        aria-label="edit"
        onClick={() => {
          setEditProps(!editProps);
        }}
      >
        <EditIcon />
      </IconButton> */}
            </div>
          </AccordionDetails>
        </Accordion>
      </SidebarTooltip>
    </Box>
  );
}

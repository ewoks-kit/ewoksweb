import React, { useEffect } from 'react';

import type { DataMapping, EwoksRFNode, Inputs } from '../types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import EditIcon from '@material-ui/icons/EditOutlined';
import { Box, Checkbox, IconButton } from '@material-ui/core';
import EditTaskProp from './EditTaskProp';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';

const useStyles = DashboardStyle;

// selectedNode details in sidebar
// Test
// unit: fake some TaskProperties and check the form
//       click and edit some properties and check the node properties
// integration: by setting a selected node and validating the form and chenge values to see
//             the selected node change
export default function NodeDetails(props) {
  const classes = useStyles();

  const { element } = props;

  const setSelectedElement = state((state) => state.setSelectedElement);
  // const selectedElement = state((state) => state.selectedElement);
  const [editProps, setEditProps] = React.useState<boolean>(false);
  const [defaultInputs, setDefaultInputs] = React.useState<Inputs[]>([]);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [defaultErrorNode, setDefaultErrorNode] = React.useState<boolean>(
    false
  );

  const [dataMapping, setDataMapping] = React.useState<DataMapping[]>([]);
  const [mapAllData, setMapAllData] = React.useState<boolean>(false);

  const NonEditableTaskProperties = [
    { id: 'id', label: 'Id', value: props.element.id },
    { id: 'task_icon', label: 'Icon', value: props.element.task_icon },
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
    setDefaultInputs(element.default_inputs ? element.default_inputs : []);
  }, [element.id, element]);

  const propChanged = (propKeyValue) => {
    // console.log(element, propKeyValue);
    setSelectedElement({
      ...element,
      ...propKeyValue,
    });
  };

  const addDefaultInputs = () => {
    const el = element as EwoksRFNode;
    const elIn = el.default_inputs;
    if (elIn && elIn[elIn.length - 1] && elIn[elIn.length - 1].id === '') {
      // console.log('should not ADD default');
    } else {
      setSelectedElement(
        {
          ...element,
          default_inputs: [...elIn, { id: '', name: '', value: '' }],
        },
        'fromSaveElement'
      );
    }
  };

  const defaultInputsChanged = (table) => {
    setSelectedElement(
      {
        ...element,
        default_inputs: table.map((dval) => {
          return {
            id: dval.name,
            name: dval.name,
            value: dval.value,
          };
        }),
      },
      'fromSaveElement'
    );
  };

  const inputsCompleteChanged = (event) => {
    setInputsComplete(event.target.checked);
    setSelectedElement(
      {
        ...element,
        inputs_complete: event.target.checked,
      },
      'fromSaveElement'
    );
  };

  const defaulErrortNodeChanged = (event) => {
    setDefaultErrorNode(event.target.checked);
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
    // console.log(event.target.checked);
    setMapAllData(event.target.checked);

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
      {NonEditableTaskProperties.map(({ id, label, value }) => (
        <div key={id} className={classes.detailsLabels}>
          <b>{label}:</b> {typeof value === 'object' ? value.join(', ') : value}
        </div>
      ))}
      <IconButton
        style={{ padding: '0px' }}
        aria-label="edit"
        onClick={() => {
          setEditProps(!editProps);
        }}
      >
        <EditIcon />
      </IconButton>
      <div>
        <hr />
        <b>Default Inputs </b>
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
      <hr />
      <div>
        <b>Default Error Node</b>
        <Checkbox
          checked={defaultErrorNode}
          onChange={defaulErrortNodeChanged}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>
      {defaultErrorNode && (
        <div>
          <b>Map all Data</b>
          <Checkbox
            checked={mapAllData}
            onChange={mapAllDataChanged}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
      )}
      {defaultErrorNode && !mapAllData && (
        <div>
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
          <hr />
        </div>
      )}
    </Box>
  );
}

import React, { useEffect } from 'react';
import useStore from '../store';
import type { EwoksRFNode, Inputs } from '../types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import EditIcon from '@material-ui/icons/EditOutlined';
import { Box, Checkbox, IconButton } from '@material-ui/core';
import EditTaskProp from './EditTaskProp';

export default function NodeDetails(propsIn) {
  const { props } = propsIn;
  const { element } = props;
  const { setElement } = propsIn;

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const [editProps, setEditProps] = React.useState<boolean>(false);
  const [defaultInputs, setDefaultInputs] = React.useState<Inputs[]>([]);
  const [inputsComplete, setInputsComplete] = React.useState<boolean>(false);
  const [moreHandles, setMoreHandles] = React.useState<boolean>(true);

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
    console.log(element);
    setInputsComplete(!!element.inputs_complete);
    setMoreHandles(!!element.data.moreHandles);
    setDefaultInputs(element.default_inputs ? element.default_inputs : []);
  }, [element.id, element]);

  const propChanged = (propKeyValue) => {
    // setTaskIdentifier(event.target.value);
    setElement({
      ...element,
      ...propKeyValue,
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

  return (
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
  );
}

import { useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import EditableTable from '../Sidebar/EditableTableProperties/EditableTable';
import type { EditableTableRow } from 'types';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import useNodeDataStore from '../../store/useNodeDataStore';
import AddRowButton from '../Sidebar/EditableTableProperties/AddRowButton';
import ToolsCell from '../Sidebar/EditableTableProperties/ToolsCell';
import { nanoid } from 'nanoid';

interface ExecutionDefaultInputs {
  name: string;
  value: unknown;
  id?: string;
  label?: string;
  taskIdentifier?: string;
  all?: boolean;
}

export interface ExecutionParams {
  defaultInputs?: ExecutionDefaultInputs[];
  workerOptions?: string[];
  queue?: string;
}

export interface ExecuteParametersDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  executeWorkflow: (params?: ExecutionParams) => Promise<void>;
}

interface DefaultInputRow extends EditableTableRow {
  nodeLabel: string;
  nodeId?: string;
}

export default function ExecuteParametersDialog(
  props: ExecuteParametersDialogProps
) {
  const { onClose, open, executeWorkflow } = props;

  const nodesData = useNodeDataStore();

  const [defaultInputs, setDefaultInputs] = useState<DefaultInputRow[]>([]);

  function handleCancel() {
    onClose();
  }

  function handleClose() {
    onClose();
  }

  function handleExecute() {
    const execDefaultInputs: ExecutionDefaultInputs[] = defaultInputs.map(
      (input) => {
        return {
          name: input.name || '',
          value: input.value,
          id: ['All nodes', 'All input nodes'].includes(input.nodeLabel)
            ? ''
            : input.nodeId,
        };
      }
    );

    executeWorkflow({ defaultInputs: execDefaultInputs });
  }

  function defaultInputChanged(input: DefaultInputRow, row: EditableTableRow) {
    const newInputRow = {
      ...input,
      name: row.name,
      type: row.type,
      value: row.value,
    };

    const otherInputs = defaultInputs.filter((inp) => inp.id !== input.id);

    setDefaultInputs([...otherInputs, newInputRow]);
  }

  function handleChangeTarget(input: DefaultInputRow, targetNodeId: string) {
    const newInputRow = {
      ...input,
      nodeLabel: nodesData.nodesData.get(targetNodeId)?.ewoks_props.label || '',
      nodeId: ['All nodes', 'All input nodes'].includes(targetNodeId)
        ? ''
        : targetNodeId,
    };

    const otherInputs = defaultInputs.filter((inp) => inp.id !== input.id);

    setDefaultInputs([...otherInputs, newInputRow]);
  }

  function handleRowAddition() {
    setDefaultInputs([
      ...defaultInputs,
      {
        id: nanoid(),
        nodeLabel: 'All nodes',
        nodeId: '',
        name: '',
        value: '',
      },
    ]);
  }

  function handleRowDelete(input: DefaultInputRow) {
    const newInputs = defaultInputs.filter((inp) => inp.id !== input.id);

    setDefaultInputs(newInputs);
  }

  return (
    <Dialog
      maxWidth="xl"
      aria-labelledby="add-subgraph-dialog"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Execution Parameters</DialogTitle>
      <DialogContent>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Workflow Inputs</h4>
            {defaultInputs.map((input) => (
              <span style={{ display: 'flex' }} key={input.id}>
                <FormControl
                  style={{ minWidth: '180px', margin: '5px' }}
                  variant="filled"
                >
                  <InputLabel>Node/s</InputLabel>
                  <Select
                    native
                    defaultValue={input.nodeLabel}
                    onChange={(ev) => {
                      console.log(ev);

                      handleChangeTarget(input, ev.target.value as string);
                    }}
                  >
                    <option value="All nodes">All nodes</option>
                    <option value="All input nodes">All input nodes</option>
                    <optgroup label="Specific Nodes">
                      {[...nodesData.nodesData].map(([key, value]) => (
                        <option value={key} key={key}>
                          {value.ewoks_props.label}
                          {/* id: {key}- label: {value.ewoks_props.label} */}
                        </option>
                      ))}
                    </optgroup>
                  </Select>
                </FormControl>
                <EditableTable
                  graphDefaultInputs
                  headers={['Input Name', 'Value']}
                  defaultValues={[
                    {
                      id: input.id,
                      name: input.name,
                      value: input.value,
                      type: input.type,
                    },
                  ]}
                  valuesChanged={(rows: EditableTableRow[]) =>
                    defaultInputChanged(input, rows[0])
                  }
                  typeOfValues={[
                    {
                      typeOfInput: 'select',
                      values: [
                        ...((input.nodeId &&
                          nodesData.nodesData.get(input.nodeId)?.task_props
                            .required_input_names) ||
                          []),
                        ...((input.nodeId &&
                          nodesData.nodesData.get(input.nodeId)?.task_props
                            .optional_input_names) ||
                          []),
                      ],
                      // requiredValues:
                      //   nodeData.task_props.required_input_names || [],
                    },
                    { typeOfInput: 'input' },
                  ]}
                />
                <ToolsCell onDelete={() => handleRowDelete(input)} />
              </span>
            ))}
            <AddRowButton onClick={() => handleRowAddition()} />
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Executions Arguments</h4>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Worker options</h4>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Parameters (keywords)</h4>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExecute} color="primary">
          Execute
        </Button>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

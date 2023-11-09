import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
} from '@mui/material';
import Button from '@mui/material//Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import type { EditableTableRow } from 'types';

import useNodeDataStore from '../../store/useNodeDataStore';
import AddEntryRow from '../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../Sidebar/table/controls/RemoveRowButton';
import EditableTable from '../Sidebar/table/EditableTable';

interface ExecutionPerNodeInputs {
  name: string;
  value: unknown;
  id?: string;
  label?: string;
  taskIdentifier?: string;
  all?: boolean;
}

export interface ExecutionParams {
  workerOptions?: Record<string, unknown>;
  executeArgs?: { perNodeInputs?: ExecutionPerNodeInputs[]; engine?: string };
}

export interface ExecuteDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  executeWorkflow: (params?: ExecutionParams) => Promise<void>;
}

interface DefaultInputRow extends EditableTableRow {
  nodeLabel: string;
  nodeId?: string;
}

export default function ExecuteParametersDialog(props: ExecuteDialogProps) {
  const { onClose, open, executeWorkflow } = props;

  const nodesData = useNodeDataStore();

  const [perNodeInputs, setPerNodeInputs] = useState<DefaultInputRow[]>([]);
  const [engine, setEngine] = useState('default');

  function handleExecute() {
    const execDefaultInputs: ExecutionPerNodeInputs[] = perNodeInputs.map(
      (input) => {
        return {
          name: input.name || '',
          value: input.value,
          id: ['All nodes', 'All input nodes'].includes(input.nodeLabel)
            ? ''
            : input.nodeId,
        };
      },
    );

    executeWorkflow({
      executeArgs: { engine, perNodeInputs: execDefaultInputs },
      workerOptions: {},
    });
  }

  function perNodeInputChanged(
    newInput: DefaultInputRow,
    row: EditableTableRow,
  ) {
    const newInputRow = {
      ...newInput,
      name: row.name,
      type: row.type,
      value: row.value,
    };

    const newInputs = perNodeInputs.map((input) => {
      if (input.id === newInput.id) {
        return newInputRow;
      }
      return input;
    });

    setPerNodeInputs(newInputs);
  }

  function handleChangeTarget(input: DefaultInputRow, targetNodeId: string) {
    const newInputRow = {
      ...input,
      nodeLabel: nodesData.nodesData.get(targetNodeId)?.ewoks_props.label || '',
      nodeId: ['All nodes', 'All input nodes'].includes(targetNodeId)
        ? ''
        : targetNodeId,
    };

    const otherInputs = perNodeInputs.filter((inp) => inp.id !== input.id);

    setPerNodeInputs([...otherInputs, newInputRow]);
  }

  function handleRowAddition() {
    setPerNodeInputs([
      ...perNodeInputs,
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
    const newInputs = perNodeInputs.filter((inp) => inp.id !== input.id);

    setPerNodeInputs(newInputs);
  }

  return (
    <Dialog
      maxWidth="xl"
      aria-labelledby="add-subgraph-dialog"
      open={open}
      onClose={() => onClose()}
    >
      <DialogTitle>Execution Parameters</DialogTitle>
      <DialogContent>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Workflow Inputs</h4>
            {perNodeInputs.map((input) => (
              <div style={{ display: 'flex' }} key={input.id}>
                <FormControl
                  style={{ minWidth: '180px', margin: '5px' }}
                  variant="filled"
                >
                  <InputLabel>Node/s</InputLabel>
                  <Select
                    native
                    defaultValue={input.nodeLabel}
                    onChange={(ev) => {
                      handleChangeTarget(input, ev.target.value);
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
                    perNodeInputChanged(input, rows[0])
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
                    },
                    { typeOfInput: 'input' },
                  ]}
                />
                <RemoveRowButton onDelete={() => handleRowDelete(input)} />
              </div>
            ))}
            <Table>
              <TableBody>
                <AddEntryRow onClick={() => handleRowAddition()} colSpan={4} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
              <b style={{ marginTop: '16px' }}>Execution engine</b>
              {/* <InputLabel id="demo-simple-select-label"></InputLabel> */}
              <Select
                value={engine}
                onChange={(event) => setEngine(event.target.value)}
                style={{
                  minWidth: '150px',
                  marginLeft: '15px',
                }}
              >
                <MenuItem value="default">default</MenuItem>
                <MenuItem value="pypushflow">pypushflow</MenuItem>
                <MenuItem value="dask">dask</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExecute} color="primary">
          Execute
        </Button>
        <Button onClick={() => onClose()} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

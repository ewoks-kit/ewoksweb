import {
  Card,
  CardContent,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Button from '@mui/material//Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { nanoid } from 'nanoid';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { EditableTableRow } from 'types';

import useNodeDataStore from '../../store/useNodeDataStore';
import AddEntryRow from '../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../Sidebar/table/controls/TypeSelectCell';
import CustomTableCell from '../Sidebar/table/CustomTableCell';
import TableCellInEditMode from '../Sidebar/table/TableCellInEditMode';
// import EditableTable from '../Sidebar/table/EditableTable';
// import TableHeader from '../Sidebar/table/TableHeader';
// import TableHeader from '../Sidebar/table/TableHeader';
// import styles from './Table.module.css';
import styles from '../Sidebar/table/TableHeader.module.css';
import { isClass } from '../Sidebar/table/utils';

interface ExecutionPerNodeInputs {
  name: string | number;
  type?: string;
  value: unknown;
  id?: string;
  label?: string;
  taskIdentifier?: string;
  nodeId?: string;
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

  const nodesData = useNodeDataStore((state) => state.nodesData);

  const [perNodeInputs, setPerNodeInputs] = useState<ExecutionPerNodeInputs[]>(
    [],
  );
  const [engine, setEngine] = useState('default');

  function handleExecute() {
    const execDefaultInputs: ExecutionPerNodeInputs[] = perNodeInputs.map(
      (input) => {
        return {
          name: input.name || '',
          type: input.type || 'string',
          value: input.value,
          id:
            input.label &&
            ['All nodes', 'All input nodes'].includes(input.label)
              ? ''
              : input.id,
        };
      },
    );

    executeWorkflow({
      executeArgs: { engine, perNodeInputs: execDefaultInputs },
      workerOptions: {},
    });
  }

  function handleChangeTarget(
    input: ExecutionPerNodeInputs,
    targetNodeId: string,
  ) {
    const newInputRow = {
      ...input,
      nodeLabel: nodesData.get(targetNodeId)?.ewoks_props.label || '',
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
        label: 'All nodes',
        nodeId: '',
        name: '',
        value: '',
      },
    ]);
  }

  function handleRowDelete(input: ExecutionPerNodeInputs) {
    // only one row to delete with the select node dropdown
    const newInputs = perNodeInputs.filter((inp) => inp.id !== input.id);

    setPerNodeInputs(newInputs);
  }

  function onChangeName(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number,
  ) {
    console.log(e, row, index, perNodeInputs);

    const newRows = perNodeInputs.map((inputRow) => {
      if (inputRow.id === row.id) {
        return {
          ...inputRow,
          name: e.target.value,
        };
      }
      return inputRow;
    });

    setPerNodeInputs(newRows);
  }

  function onChangeValue(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number,
  ) {
    console.log(e, row, index, perNodeInputs);

    const { id } = row;
  }

  const changedTypeOfInput = (
    e: ChangeEvent<HTMLInputElement>,
    row: ExecutionPerNodeInputs,
    index: number,
  ) => {
    console.log(e.target.value, row, index, perNodeInputs);

    const { id: rowId = '' } = row;
    const newRows = perNodeInputs.map((inputRow) => {
      if (inputRow.id === rowId) {
        return {
          ...inputRow,
          value: e.target.value === 'null' ? e.target.value : '',
          type: e.target.value,
        };
      }
      return inputRow;
    });

    setPerNodeInputs(newRows);
  };

  function handleEdit(row: ExecutionPerNodeInputs, index: number) {
    console.log(row, index, perNodeInputs);

    // if (['list', 'dict'].includes(typeOfInputs[index])) {
    //   showEditableDialog(
    //     id,
    //     typeOfInputs[index] === 'list' ? 'Edit list' : 'Edit dict',
    //     onListOrDict(id, index),
    //     { rows, id },
    //   );
    // }

    // setRows(calcNewRows(id));

    // const { id: rowId = '' } = row;
    // const newRows = perNodeInputs.map((inputRow) => {
    //   if (inputRow.id === rowId) {
    //     return {
    //       ...inputRow,
    //       value: e.target.value === 'null' ? e.target.value : '',
    //     };
    //   }
    //   return inputRow;
    // });

    // setPerNodeInputs(newRows);
  }

  function calcTypeAndValues(nodeId: string | undefined) {
    return {
      // calc the type and values from the node selected in the dropdown
      typeOfInput:
        nodeId && isClass(nodesData.get(nodeId)) ? 'select' : 'input',
      values: [
        ...(nodesData.get(nodeId || '')?.task_props.required_input_names || []),
        ...(nodesData.get(nodeId || '')?.task_props.optional_input_names || []),
      ],
      requiredValues:
        nodesData.get(nodeId || '')?.task_props.required_input_names || [],
    };
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={styles.cell}>
                    <b>Node/s</b>
                  </TableCell>
                  <TableCell align="left" className={styles.cell}>
                    <b>Type</b>
                  </TableCell>
                  <TableCell align="left" className={styles.cell}>
                    <b>Name</b>
                  </TableCell>
                  <TableCell align="left" className={styles.cell}>
                    <b>Value</b>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>

            {perNodeInputs.map((input, index) => (
              <div style={{ display: 'flex' }} key={input.id}>
                <Select
                  variant="standard"
                  native
                  defaultValue={input.label}
                  onChange={(ev) => {
                    handleChangeTarget(input, ev.target.value);
                  }}
                >
                  <option value="All nodes">All nodes</option>
                  <option value="All input nodes">All input nodes</option>
                  <optgroup label="Specific Nodes">
                    {[...nodesData].map(([key, value]) => (
                      <option value={key} key={key}>
                        {value.ewoks_props.label}
                        {/* id: {key}- label: {value.ewoks_props.label} */}
                      </option>
                    ))}
                  </optgroup>
                </Select>
                <Table
                  className={styles.table}
                  aria-label="editable table"
                  size="small"
                  padding="none"
                >
                  <TableBody>
                    <TableRow>
                      <TypeSelectCell
                        value={
                          perNodeInputs[index].type === 'boolean'
                            ? 'bool'
                            : perNodeInputs[index].type || 'string'
                        }
                        onChange={(e) => changedTypeOfInput(e, input, index)}
                      />
                      <TableCellInEditMode
                        index={0}
                        name="name"
                        onChange={onChangeName}
                        {...props}
                        row={perNodeInputs[index] as EditableTableRow}
                        typeOfValues={calcTypeAndValues(input.nodeId)}
                      />

                      <CustomTableCell
                        index={index}
                        row={input as EditableTableRow}
                        name="value"
                        onChange={onChangeValue}
                        onEdit={handleEdit(input, index)}
                        // disable={disable}
                      />
                    </TableRow>
                  </TableBody>
                </Table>
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

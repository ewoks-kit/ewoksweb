import { useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import EditableTable from '../Sidebar/EditableTableProperties/EditableTable';
import type { EditableTableRow, Inputs } from 'types';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import useNodeDataStore from '../../store/useNodeDataStore';
import AddRowButton from '../Sidebar/EditableTableProperties/AddRowButton';
import ToolsCell from '../Sidebar/EditableTableProperties/ToolsCell';

export interface ExecuteParametersDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  executeWorkflow: (params?: string[]) => Promise<void>;
}

interface DefaultInput extends Inputs {
  node: string;
}

export default function ExecuteParametersDialog(
  props: ExecuteParametersDialogProps
) {
  const { onClose, open, executeWorkflow } = props;

  const nodesData = useNodeDataStore();

  const [executeParams, setExecuteParams] = useState([]);
  const [defaultInputs, setDefaultInputs] = useState<DefaultInput[]>([]);

  function handleCancel() {
    onClose();
  }

  function handleClose() {
    onClose('');
  }

  function handleExecute() {
    executeWorkflow(executeParams);
  }

  function defaultInputsChanged() {
    console.log('input changed');
  }

  function addDefaultInputs(rows: EditableTableRow[] | undefined) {
    console.log(rows);
  }

  function handleChangeSpecificTarget(input: DefaultInput, targetNode: string) {
    console.log(input, targetNode, defaultInputs);

    const newInputs = defaultInputs.filter(
      (inp) => inp.node !== input.node && inp.name !== input.name
    );

    setDefaultInputs([
      ...newInputs,
      {
        node: targetNode,
        name: input.name,
        value: input.value,
        type: input.type,
      },
    ]);
  }

  function handleRowAddition() {
    console.log(defaultInputs);

    setDefaultInputs([
      ...defaultInputs,
      { node: '', id: '', name: '', value: '' },
    ]);
  }

  function handleRowDelete(input: DefaultInput) {
    const newInputs = defaultInputs.filter(
      (inp) => inp.node !== input.node && inp.name !== input.name
    );

    setDefaultInputs(newInputs);
  }

  return (
    <Dialog
      maxWidth="xl"
      aria-labelledby="add-subgraph-dialog"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="add-subgraph-dialog-title">
        Execution Parameters
      </DialogTitle>
      <DialogContent>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Default Inputs</h4>
            {defaultInputs.map((input) => (
              <div
                style={{ display: 'flex' }}
                key={`${input.node} - ${input.name}`}
              >
                <FormControl
                  style={{ minWidth: '180px', margin: '5px' }}
                  variant="filled"
                >
                  <InputLabel>Node/s</InputLabel>
                  <Select
                    native
                    defaultValue={input.node}
                    onChange={(ev) =>
                      handleChangeSpecificTarget(
                        input,
                        ev.target.value as string
                      )
                    }
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
                  headers={['Name', 'Value']}
                  defaultValues={[
                    { id: '1', name: '2', value: '1', type: 'string' },
                  ]}
                  valuesChanged={defaultInputsChanged}
                  onRowAdd={(rows) => addDefaultInputs(rows)}
                  typeOfValues={[
                    {
                      typeOfInput: 'select',
                      values: ['1', '2'],
                      // requiredValues:
                      //   nodeData.task_props.required_input_names || [],
                    },
                    { typeOfInput: 'input' },
                  ]}
                />
                <ToolsCell onDelete={() => handleRowDelete(input)} />
              </div>
            ))}
            <AddRowButton onClick={() => handleRowAddition()} />
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Worker options</h4>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ margin: '2px' }}>
          <CardContent>
            <h4>Specify queue</h4>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExecute} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

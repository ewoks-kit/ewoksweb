import { useState, useEffect } from 'react';
import { Button, Checkbox } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import type {
  GraphDetails,
  EwoksRFNodeData,
  EwoksRFLinkData,
} from '../../types';
import type { GraphFormAction } from '../../types';
import { rfToEwoks, textForError } from '../../utils';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import useStore from '../../store/useStore';
import commonStrings from '../../commonStrings.json';
import { postWorkflow, putWorkflow } from '../../api/api';
import { useReactFlow } from 'reactflow';
import { getNodesData, getEdgesData } from '../../utils';

interface Props {
  elementToEdit: GraphDetails;
  action: GraphFormAction;
  open: boolean;
  setOpenSaveDialog: Dispatch<SetStateAction<boolean>>;
}

export default function GraphFormDialog(props: Props) {
  const rfInstance = useReactFlow();

  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [overwrite, setOverwrite] = useState(false);

  const setCanvasGraphChanged = useStore((st) => st.setCanvasGraphChanged);
  const initGraph = useStore((state) => state.initGraph);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setGettingFromServer = useStore((st) => st.setGettingFromServer);
  const [element, setElement] = useState<GraphDetails>({} as GraphDetails);

  const { open, action, elementToEdit } = props;

  useEffect(() => {
    setElement(elementToEdit);
    setIsOpen(open);

    if ('label' in elementToEdit) {
      setNewName(elementToEdit.label || '');
      setOverwrite(false);
    }
  }, [open, action, elementToEdit]);

  async function handleSave() {
    // DOC: get the selected element (graph or Node) give a new name before saving
    if ('label' in element && newName) {
      saveGraph(element);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please give a name!',
        severity: 'warning',
      });
    }
  }

  async function saveGraph(graphDetails: GraphDetails) {
    const graph = {
      graph: graphDetails,
      nodes: rfInstance.getNodes().map((nod) => {
        return { ...nod, data: getNodesData().get(nod.id) as EwoksRFNodeData };
      }),
      links: rfInstance.getEdges().map((edge) => {
        return {
          ...edge,
          data: getEdgesData().get(edge.id) as EwoksRFLinkData,
        };
      }),
    };
    if (overwrite) {
      // put
      try {
        await putWorkflow(rfToEwoks(graph));

        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Graph saved successfully!',
          severity: 'success',
        });
        setCanvasGraphChanged(false);
      } catch (error) {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.savingError),
          severity: 'error',
        });
      } finally {
        props.setOpenSaveDialog(false);
      }
    } else {
      try {
        const responseNew = await postWorkflow(
          rfToEwoks({
            ...graph,
            graph: { ...graph.graph, id: newName, label: newName },
          })
        );
        setGettingFromServer(false);

        props.setOpenSaveDialog(false);

        initGraph(responseNew.data, 'fromServer', rfInstance);

        resetRecentGraphs();

        setOpenSnackbar({
          open: true,
          text: 'Graph saved successfully!',
          severity: 'success',
        });
      } catch (error) {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.savingError),
          severity: 'error',
        });
      }
    }
  }

  function newNameChanged(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setNewName(val);
    setElement({
      ...element,
      id: val,
      label: val,
    });
  }

  function handleClose() {
    props.setOpenSaveDialog(false);
    setGettingFromServer(false);
    setNewName('');
  }

  const overwriteChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setOverwrite(event.target.checked);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        Give the new Workflow name
        {action === 'newGraphOrOverwrite' &&
        'label' in elementToEdit &&
        elementToEdit.label
          ? ` or select to overwrite the existing with id: ${elementToEdit.label}`
          : ''}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          The Workflow will be saved to file with the name-identifier you will
          provide.
        </DialogContentText>
        <TextField
          margin="dense"
          id="saveAsName"
          label="New Name - Identifier"
          fullWidth
          variant="standard"
          value={newName}
          onChange={newNameChanged}
          disabled={overwrite}
          inputProps={{ 'aria-labelledby': 'saveAsName-label' }}
        />
        {['newGraphOrOverwrite', 'cloneGraph'].includes(action) && (
          <div>
            <b>Overwrite existing workflow with the same ID</b>
            <Checkbox
              checked={overwrite}
              onChange={overwriteChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleSave();
          }}
        >
          Save Workflow
        </Button>
      </DialogActions>
    </Dialog>
  );
}

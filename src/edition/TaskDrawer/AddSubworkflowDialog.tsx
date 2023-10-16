import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useRef } from 'react';
import type { XYPosition } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { fetchWorkflow } from '../../api/workflows';
import OpenGraphInput from '../../general/OpenGraphInput';
import WorkflowDropdown from '../../general/WorkflowDropdown';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { GraphEwoks, Task } from '../../types';
import { textForError } from '../../utils';
import { loadSubworkflow } from './utils';

interface Props {
  open: boolean;
  tasks: Task[];
  onClose: () => void;
  position?: XYPosition;
}

export default function AddSubworkflowDialog(props: Props) {
  const { onClose: handleClose, open, position, tasks } = props;
  const fromDiskInputRef = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();

  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  async function loadSubgraphAsNode(subgraph: GraphEwoks) {
    const nodes = rfInstance.getNodes();
    const { nodeWithoutData, data } = await loadSubworkflow(
      subgraph,
      nodes,
      rfInstance.getEdges(),
      position || { x: 0, y: 0 },
      tasks,
    );
    setNodeData(nodeWithoutData.id, data);
    rfInstance.setNodes([...nodes, nodeWithoutData]);
  }

  async function addSubgraph(id: string) {
    try {
      const { data: subgraph } = await fetchWorkflow(id);
      loadSubgraphAsNode(subgraph);
      handleClose();
    } catch (error) {
      showErrorMsg(
        textForError(
          error,
          'Error in retrieving workflow. Please check connectivity with the server!',
        ),
      );
    }
  }
  return (
    <>
      <OpenGraphInput
        ref={fromDiskInputRef}
        onGraphLoad={(subgraph) => {
          loadSubgraphAsNode(subgraph);
          handleClose();
        }}
        label="Load sub-workflow from disk"
      />

      <Dialog maxWidth="xl" open={open} onClose={handleClose}>
        <DialogTitle>Add subworkflow</DialogTitle>
        <DialogContent>
          <List>
            <ListItem divider>
              <ListItemText primary="From Server" />
              <SuspenseBoundary>
                <WorkflowDropdown
                  onChange={(workflowDetails) => {
                    addSubgraph(workflowDetails.id);
                  }}
                  style={{ width: '20rem', marginLeft: '2rem' }}
                />
              </SuspenseBoundary>
            </ListItem>
            <ListItem
              button
              divider
              onClick={() => {
                fromDiskInputRef.current?.click();
              }}
            >
              <ListItemText primary="From Disk" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

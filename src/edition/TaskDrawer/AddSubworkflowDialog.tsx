import { useRef } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import OpenGraphInput from '../../general/OpenGraphInput';
import type { GraphEwoks, Task } from '../../types';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { XYPosition } from 'reactflow';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import { fetchWorkflow } from '../../api/workflows';
import { textForError } from '../../utils';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import WorkflowDropdown from '../../general/WorkflowDropdown';
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
      tasks
    );
    rfInstance.setNodes([...nodes, nodeWithoutData]);
    setNodeData(nodeWithoutData.id, data);
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
          'Error in retrieving workflow. Please check connectivity with the server!'
        )
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
      />

      <Dialog maxWidth="xl" open={open} onClose={handleClose}>
        <DialogTitle>Add Subgraph</DialogTitle>
        <DialogContent>
          <List component="div" role="list">
            <ListItem divider role="listitem">
              <ListItemText primary="From Server" />
              <div style={{ width: '20rem', marginLeft: '0.5rem' }}>
                <SuspenseBoundary>
                  <WorkflowDropdown
                    onChange={(workflowDetails) => {
                      addSubgraph(workflowDetails.id);
                    }}
                  />
                </SuspenseBoundary>
              </div>
            </ListItem>
            <ListItem
              button
              divider
              onClick={() => {
                fromDiskInputRef.current?.click();
              }}
              role="listitem"
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

import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import OpenGraphInput from '../../general/OpenGraphInput';
import type { GraphEwoks } from '../../types';
import useStore from '../../store/useStore';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import GetWorkflowFromServerDropdown from '../../general/GetWorkflowFromServerDropdown';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { fetchWorkflow } from '../../api/workflows';
import { textForError } from '../../utils';

export interface ConfirmationDialogRawProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: (value?: string) => void;
}

export default function AddSubgraphDialog(props: ConfirmationDialogRawProps) {
  const { onClose, open, setOpen } = props;
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();

  const [subgraphWorkflowId, setSubgraphWorkflowId] = useState('');

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  async function handleSubgraphLoad(subgraph: GraphEwoks) {
    const nodes = rfInstance.getNodes();
    const { nodeWithoutData, data } = await setSubGraph(
      subgraph,
      nodes,
      rfInstance.getEdges()
    );
    rfInstance.setNodes([...nodes, nodeWithoutData]);
    setNodeData(nodeWithoutData.id, data);
  }

  const handleCancel = () => {
    onClose();
  };

  const handleClose = () => {
    onClose('');
  };

  async function addSubgraph() {
    if (!subgraphWorkflowId) {
      return;
    }
    try {
      const { data: subgraph } = await fetchWorkflow(subgraphWorkflowId);
      const nodes = rfInstance.getNodes();
      const { nodeWithoutData, data } = await setSubGraph(
        subgraph,
        nodes,
        rfInstance.getEdges()
      );
      rfInstance.setNodes([...nodes, nodeWithoutData]);
      setNodeData(nodeWithoutData.id, data);
      handleClose();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(
          error,
          'Error in retrieving workflow. Please check connectivity with the server!'
        ),
        severity: 'error',
      });
    }
  }
  return (
    <>
      <OpenGraphInput
        ref={ref}
        onGraphLoad={(subgraph) => {
          handleSubgraphLoad(subgraph);
        }}
      />

      <Dialog
        maxWidth="xl"
        aria-labelledby="add-subgraph-dialog"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="add-subgraph-dialog-title">Add Subgraph</DialogTitle>
        <DialogContent>
          <List component="div" role="list">
            <ListItem button divider role="listitem">
              <ListItemText primary="From Server" />
              <span style={{ marginLeft: '20px', display: 'flex' }}>
                <GetWorkflowFromServerDropdown
                  getSubgraph
                  setSubgraphId={(id) => setSubgraphWorkflowId(id)}
                />
                <Button
                  color="primary"
                  onClick={(event) => {
                    event.preventDefault();
                    addSubgraph();
                  }}
                  size="small"
                  aria-controls="editSidebar-dropdown-menu"
                  aria-label="Open edit actions menu"
                >
                  <CloudDownloadIcon />
                </Button>
              </span>
            </ListItem>
            <ListItem
              button
              divider
              aria-controls="ringtone-menu"
              aria-label="phone ringtone"
              onClick={() => {
                ref.current?.click();
                handleClose();
              }}
              role="listitem"
            >
              <ListItemText primary="From Disk" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

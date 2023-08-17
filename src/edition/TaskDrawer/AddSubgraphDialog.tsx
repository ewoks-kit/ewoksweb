import React, { useRef } from 'react';
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

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();

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

  const handleOk = () => {
    onClose('');
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue((event.target as HTMLInputElement).value);
  // };

  return (
    <>
      <OpenGraphInput
        ref={ref}
        onGraphLoad={(subgraph) => {
          handleSubgraphLoad(subgraph);
        }}
      />

      <Dialog
        maxWidth="xs"
        // onEntering={handleEntering}
        aria-labelledby="confirmation-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Add Subgraph</DialogTitle>
        <DialogContent dividers>
          <List component="div" role="list">
            <ListItem button divider role="listitem">
              <ListItemText primary="From Server" />
              <GetWorkflowFromServerDropdown />
            </ListItem>
            <ListItem
              button
              divider
              aria-controls="ringtone-menu"
              aria-label="phone ringtone"
              onClick={() => {
                ref.current?.click();
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

export default function AddSubgraphDialog(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { open, setOpen } = props;
  const [value, setValue] = React.useState('Dione');

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue?: string) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <ConfirmationDialogRaw
      id="ringtone-menu"
      keepMounted
      open={open}
      onClose={handleClose}
      value={value}
    />
  );
}

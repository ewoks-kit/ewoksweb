import { useState } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export interface ExecuteParametersDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  executeWorkflow: (params?: string[]) => Promise<void>;
}

export default function ExecuteParametersDialog(
  props: ExecuteParametersDialogProps
) {
  const { onClose, open, executeWorkflow } = props;

  const [executeParams, setExecuteParams] = useState([]);

  const handleCancel = () => {
    onClose();
  };

  const handleClose = () => {
    onClose('');
  };

  function handleExecute() {
    executeWorkflow(executeParams);
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
        <List component="div" role="list">
          <ListItem divider role="listitem">
            <ListItemText primary="Default Inputs" />
          </ListItem>
          <ListItem
            divider
            aria-controls="ringtone-menu"
            aria-label="phone ringtone"
            // onClick={() => {
            //   handleClose();
            // }}
            role="listitem"
          >
            <ListItemText primary="From Disk" />
          </ListItem>
        </List>
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

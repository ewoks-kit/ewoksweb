import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { rfToEwoks } from '../utils';

import ReactJson from 'react-json-view';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { TextField, Tooltip } from '@material-ui/core';
import state from '../store/state';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  // { open, content }
  const [graph, setGraph] = React.useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [name, setName] = React.useState('');
  const [callbackProps, setCallbackProps] = React.useState({});
  const graphRF = state((state) => state.graphRF);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  const [selection, setSelection] = React.useState('ewoks');

  const { open, content } = props;

  useEffect(() => {
    // console.log(content, open);
    setGraph((content && content.object) || {});
    setIsOpen(open || false);
    setTitle((content && content.title) || '');
    setCallbackProps(content.callbackProps);
    setName(content.id || '');
  }, [open, content]);

  // const handleClickOpen = () => {
  //   setGraph(rfToEwoks(graphRF));
  // };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    if (name) {
      setIsOpen(false);
      // console.log(name, graph, callbackProps);
      props.setValue(name, graph, callbackProps);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please put a Name for the parameter!',
        severity: 'warning',
      });
    }
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string
  ) => {
    setSelection(newSelection);
    setTitle(newSelection === 'ewoks' ? 'Ewoks Graph' : 'RF Graph');
    setGraph(newSelection === 'ewoks' ? rfToEwoks(graphRF) : graphRF);
    setIsOpen(true);
  };

  const graphChanged = (edit) => {
    setGraph(edit.updated_src);
  };
  // TODO: there is a error with react
  // React does not recognize the `inputRef` prop on a DOM element.
  // if not upgrade material fix it
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {title || ''}
      </DialogTitle>
      <DialogContent style={{ minHeight: '300px' }}>
        <DialogContentText>
          {['Ewoks Graph', 'RF Graph'].includes(title) && (
            <ToggleButtonGroup
              color="primary"
              value={selection}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="ewoks">Ewoks Graph</ToggleButton>
              <ToggleButton value="rf">RF Graph</ToggleButton>
            </ToggleButtonGroup>
          )}
          <div style={{ marginBottom: '10px' }}>
            <Tooltip title="Input the name of parameter" arrow>
              <TextField
                label="Name"
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Tooltip>
          </div>
          <ReactJson
            src={graph}
            name="value"
            theme="monokai"
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            enableClipboard={false}
            onEdit={(edit) => graphChanged(edit)}
            onAdd={(add) => graphChanged(add)}
            defaultValue="graph"
            onDelete={(del) => graphChanged(del)}
            onSelect={() => true}
            quotesOnKeys={false}
            style={{ backgroundColor: 'rgb(59, 77, 172)' }}
            displayDataTypes
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

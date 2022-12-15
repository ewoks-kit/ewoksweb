import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import type { PaperProps } from '@material-ui/core/Paper';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { rfToEwoks } from 'utils';

import ReactJson from 'react-json-view';
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from '@material-ui/lab';
import { FormControl, TextField, Tooltip } from '@material-ui/core';
import useStore from 'store/useStore';

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

// TODO: Improve typings
type Graph = object;
type CallbackProps = unknown;

interface Props {
  content: {
    object?: Graph;
    title?: string;
    id?: string;
    callbackProps?: CallbackProps;
  };
  open: boolean;
  typeOfValues?: { values?: string[]; type: string };
  setValue?: (name: string, graph: Graph, cp: CallbackProps) => void;
}

export default function DraggableDialog(props: Props) {
  const [graph, setGraph] = useState<Graph>({});
  const [oldGraph, setOldGraph] = useState<Graph>({});
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [oldName, setOldName] = useState('');
  const [callbackProps, setCallbackProps] = useState<CallbackProps>({});
  const graphRF = useStore((state) => state.graphRF);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const [selection, setSelection] = useState('ewoks');

  const { open, content, typeOfValues } = props;

  useEffect(() => {
    setGraph(content?.object || {});
    setOldGraph(content?.object || {});
    setIsOpen(open || false);
    setTitle(content?.title || '');
    setCallbackProps(content.callbackProps);
    setName(content.id || '');
    setOldName(content.id || '');
  }, [open, content]);

  const handleClose = () => {
    setIsOpen(false);
    props.setValue(oldName, oldGraph, callbackProps);
  };

  const handleSave = () => {
    if (name) {
      setIsOpen(false);
      props.setValue(name, graph, callbackProps);
      return;
    }

    setOpenSnackbar({
      open: true,
      text: 'Please put a Name for the parameter!',
      severity: 'warning',
    });
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

  const graphChanged = (edit: { updated_src: Graph }) => {
    setGraph(edit.updated_src);
  };

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
            <Tooltip
              title="Input the name of parameter"
              arrow
              placement="top-start"
            >
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={typeOfValues?.values || ['set a name']}
                  value={name}
                  onChange={(e, val) => setName(val)}
                  onInputChange={(e, val) => setName(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={typeOfValues.type || 'name'}
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
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
            defaultValue="value"
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

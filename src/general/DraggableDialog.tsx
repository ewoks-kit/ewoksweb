import { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import type { PaperProps } from '@material-ui/core/Paper';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import ReactJson from 'react-json-view';
import type { EditableTableRow } from '../types';

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
interface CallbackProps {
  id: string;
  rows: EditableTableRow[];
}

interface Props {
  content: {
    object?: Graph;
    title?: string;
    id?: string;
    callbackProps: CallbackProps;
  };
  open: boolean;
  setValue: (name: string, graph: Graph, callbackProps: CallbackProps) => void;
}

export default function DraggableDialog(props: Props) {
  const [graph, setGraph] = useState<Graph>({});
  const [oldGraph, setOldGraph] = useState<Graph>({});
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [oldName, setOldName] = useState('');
  const [callbackProps, setCallbackProps] = useState<CallbackProps>({
    id: '',
    rows: [],
  });

  const { open, content } = props;

  useEffect(() => {
    setGraph(content.object || {});
    setOldGraph(content.object || {});
    setIsOpen(open || false);
    setTitle(content.title || '');
    setCallbackProps(content.callbackProps);
    setName(content.id || '');
    setOldName(content.id || '');
  }, [open, content]);

  const handleClose = () => {
    setIsOpen(false);
    props.setValue(oldName, oldGraph, callbackProps);
  };

  const handleSave = () => {
    setIsOpen(false);
    props.setValue(name, graph, callbackProps);
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
      <DialogContent style={{ minHeight: '300px', minWidth: '380px' }}>
        <DialogContentText>
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

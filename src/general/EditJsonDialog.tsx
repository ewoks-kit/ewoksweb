import ReactJson from '@microlink/react-json-view';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

interface Props {
  value: object;
  title: string;
  open: boolean;
  onClose: () => void;
  setValue: (newValue: object) => void;
}

export default function EditJsonDialog(props: Props) {
  const { value, title, open, setValue, onClose } = props;

  const [editedObject, setEditedObject] = useState<object>(value);

  const handleSave = () => {
    setValue(editedObject);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent style={{ minHeight: '300px', minWidth: '380px' }}>
        <DialogContentText>
          <ReactJson
            src={editedObject}
            name="value"
            theme="monokai"
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            enableClipboard={false}
            onEdit={(edit) => setEditedObject(edit.updated_src)}
            onAdd={(add) => setEditedObject(add.updated_src)}
            defaultValue="value"
            onDelete={(del) => setEditedObject(del.updated_src)}
            quotesOnKeys={false}
            style={{ backgroundColor: 'rgb(59, 77, 172)' }}
            displayDataTypes
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

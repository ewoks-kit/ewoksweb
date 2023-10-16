import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  agreeCallback(): Promise<void> | void;
  disagreeCallback(): void;
}
// DOC: Used as an app-wide dialog when confirmation is needed. Open is a prop
export default function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, title, content } = props;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleDisagree = () => {
    setIsOpen(false);
    props.disagreeCallback();
  };

  const handleAgree = () => {
    setIsOpen(false);
    props.agreeCallback();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>No</Button>
        <Button onClick={handleAgree}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

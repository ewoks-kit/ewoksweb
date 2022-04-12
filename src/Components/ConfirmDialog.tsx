import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmDialog(props) {
  const { open, title, content, agreeCallback, disagreeCallback } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleDisagree = () => {
    setIsOpen(false);
    disagreeCallback();
  };

  const handleAgree = () => {
    setIsOpen(false);
    agreeCallback();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree}>No</Button>
        <Button onClick={handleAgree}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

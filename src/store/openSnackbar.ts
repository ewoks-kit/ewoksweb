const openSnackbar = (set, get) => ({
  openSnackbar: { open: false, text: '', severity: 'success' },

  setOpenSnackbar: (setOpen) => {
    set((state) => ({
      ...state,
      openSnackbar: setOpen,
    }));
  },
});

export default openSnackbar;

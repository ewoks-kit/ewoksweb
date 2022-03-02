const openDraggableDialog = (set) => ({
  openDraggableDialog: { open: false, content: {} },

  setOpenDraggableDialog: ({ open, content }) => {
    set((state) => ({
      ...state,
      openDraggableDialog: { open, content },
    }));
  },
});

export default openDraggableDialog;

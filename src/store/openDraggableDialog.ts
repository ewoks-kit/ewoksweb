const openDraggableDialog = (set, get) => ({
  openDraggableDialog: { open: false, content: {} },

  setOpenDraggableDialog: ({ open, content }) => {
    set((state) => ({
      ...state,
      openDraggableDialog: { open, content },
    }));
  },
});

export default openDraggableDialog;

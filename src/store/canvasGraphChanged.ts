const canvasGraphChanged = (set) => ({
  canvasGraphChanged: false,

  setCanvasGraphChanged: (isChanged) => {
    // console.log(isChanged);
    set((state) => ({
      ...state,
      canvasGraphChanged: isChanged,
    }));
  },
});

export default canvasGraphChanged;

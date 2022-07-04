const openSettingsDrawer = (set) => ({
  openSettingsDrawer: '',

  setOpenSettingsDrawer: (openTab) => {
    console.log(openTab);
    set((state) => ({
      ...state,
      openSettingsDrawer: openTab,
    }));
  },
});

export default openSettingsDrawer;

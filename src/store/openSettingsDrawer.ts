const openSettingsDrawer = (set) => ({
  openSettingsDrawer: 'Workflows',

  setOpenSettingsDrawer: (openTab) => {
    console.log(openTab);
    set((state) => ({
      ...state,
      openSettingsDrawer: openTab,
    }));
  },
});

export default openSettingsDrawer;

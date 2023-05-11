import create from 'zustand';

export interface ToggleAddNodesSidebarState {
  openAddNodesSidebar: boolean;
  setOpenAddNodesSidebar: (open: boolean) => void;
}

// DOC: use it if draggable dialog needs to open by many places
const toggleAddNodesSidebar = create<ToggleAddNodesSidebarState>((set) => ({
  openAddNodesSidebar: false,

  setOpenAddNodesSidebar: (open) => {
    set((state) => ({
      ...state,
      openAddNodesSidebar: open,
    }));
  },
}));

export default toggleAddNodesSidebar;

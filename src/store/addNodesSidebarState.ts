import create from 'zustand';

export interface ToggleAddNodesSidebarState {
  isAddNodesSidebarOpen: boolean;
  toggleAddNodesSidebar: (open: boolean) => void;
}

// DOC: use it if draggable dialog needs to open by many places
const addNodesSidebarState = create<ToggleAddNodesSidebarState>((set) => ({
  isAddNodesSidebarOpen: true,

  toggleAddNodesSidebar: (open) => {
    set((state) => ({
      ...state,
      openAddNodesSidebar: open,
    }));
  },
}));

export default addNodesSidebarState;

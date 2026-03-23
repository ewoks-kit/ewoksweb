import { useTheme } from '@mui/material';

export function useDrawerStyles(): { zIndex: number; transition: string } {
  const { zIndex, transitions } = useTheme();

  return {
    zIndex: zIndex.drawer,
    transition: transitions.create(['width'], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
  };
}

import { useTheme } from '@mui/material';

export function useDrawerStyles(): { zIndex: number; transition: string } {
  const { zIndex, transitions } = useTheme();

  return {
    zIndex: zIndex.drawer,
    // eslint-disable-next-line etc/no-internal
    transition: transitions.create(['width'], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
  };
}

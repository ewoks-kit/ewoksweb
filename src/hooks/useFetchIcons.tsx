// TODO: Keep it to test hooks for REST actions
// when use as suggested in react documentation it made several
// un-needed refetches on component rerendering. Need to use it on click
import getIconsFromServer from '../utils/getIconsFromServer';
import useStore from '../store/useStore';
import type { Icon } from '../types';
import commonStrings from '../commonStrings.json';

export default function useFetchIcons() {
  const setAllIcons = useStore((state) => state.setAllIcons);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  return async () => {
    try {
      const icons: Icon[] | object = await getIconsFromServer();

      if (Array.isArray(icons) && icons?.length > 0) {
        setAllIcons([...icons]);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || commonStrings.retrieveIconsError,
        severity: 'error',
      });
    }
  };
}

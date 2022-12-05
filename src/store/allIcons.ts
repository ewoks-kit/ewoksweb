import type { Icon } from '../types';
import { getIcon, getIcons } from 'utils/api';
import axios from 'axios';
import path from 'path';

const allIcons = (set, get) => ({
  allIcons: [],

  setAllIcons: (icons: [Icon], fromServer) => {
    if (fromServer) {
      fetchIcons(set, get);
    } else {
      set((state) => ({
        ...state,
        allIcons: icons,
      }));
    }
  },
});

// TODO: fetching of icons should be moved out of the state in a dedicated function
// fetchIcons or getIconsFromServer. And then, you call fetchIcons getting the result
// in a variable followed by the setAllIcons to update the state.
const fetchIcons = async (set, get) => {
  const data = await getIcons();

  const resultIcons = await axios
    .all(data.identifiers.map((id: string) => getIcon(id)))
    .then(
      axios.spread((...res) => {
        const resCln = res.filter((result) => result.data !== null);
        return resCln.map((result) => {
          return {
            name: path.basename(result.config.url),
            image: result.data,
            type: path.extname(result.config.url),
          };
        });
      })
    )
    .catch((error) => {
      get().setOpenSnackbar({
        open: true,
        text: error?.data,
        severity: 'warning',
      });
      return [];
    });

  get().setAllIconNames(data.identifiers.map((id: string) => id));
  get().setAllIcons([...resultIcons]);
};

export default allIcons;

import type { Icon } from '../types';
import { getIcon, getIcons, getOtherIcon } from 'utils/api';
import axios from 'axios';
import path from 'path';

const allIcons = (set, get) => ({
  allIcons: [],

  setAllIcons: (icons: [Icon], fromServer) => {
    const fetchIcons = async () => {
      const data = await getIcons();

      const iconsPng = data.identifiers.filter((str) => {
        return !str.endsWith('svg');
      });

      await axios
        .all(iconsPng.map((id: string) => getOtherIcon(id)))
        .then(
          axios.spread((...resPng) => {
            const resCln = resPng.filter((result) => result.data !== null);
            return resCln.map((result) => {
              const blobPng = new Blob([result.data], {
                type: 'image/png',
              });
              const fileReader = new FileReader();
              fileReader.readAsDataURL(blobPng);

              return result.data;
            });
          })
        )
        .catch((error) => {
          // TODO: remove after handling the error
          get().setOpenSnackbar({
            open: true,
            text: error.data,
            severity: 'error',
          });
          return [];
        });

      const iconsSvg = data.identifiers.filter((str) => {
        return str.endsWith('svg');
      });

      get().setAllIconNames([...iconsSvg, ...iconsPng]);

      const results = await axios
        .all(iconsSvg.map((id: string) => getIcon(id)))
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
          // TODO: remove after handling the error
          get().setOpenSnackbar({
            open: true,
            text: error.data,
            severity: 'warning',
          });
          return [];
        });
      get().setAllIcons(results as Icon[]);
    };

    if (fromServer) {
      fetchIcons();
    } else {
      set((state) => ({
        ...state,
        allIcons: icons,
      }));
    }
  },
});

export default allIcons;

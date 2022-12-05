// TODO: remove the following brings another typescript error sine await is there
/* eslint-disable sonarjs/prefer-immediate-return */
import { getIcon, getIcons } from './api';
import axios from 'axios';
import path from 'path';
import type { Icon } from '../types';

async function getIconsFromServer(): Promise<Icon[] | object> {
  const data = await getIcons();

  const resultIcons: Icon[] | object = await axios
    .all(data.identifiers.map((id: string) => getIcon(id)))
    .then(
      axios.spread((...res) => {
        const resCln = res.filter((result) => result.data !== null);
        return resCln.map((result) => {
          const imgbase64: { data_url: string } = (result.data as unknown) as {
            data_url: string;
          };
          return {
            name: path.basename(result.config.url),
            image: imgbase64,
            type: path.extname(result.config.url),
          } as Icon;
        });
      })
    )
    .catch((error) => {
      return error;
    });

  return resultIcons;
}
export default getIconsFromServer;

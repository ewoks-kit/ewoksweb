/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/prefer-await-to-callbacks */
import { getIcon, getIcons } from './api';
import path from 'path';
import type { Icon } from '../types';

async function getIconsFromServer(): Promise<Icon[] | object> {
  const data = await getIcons();

  return Promise.all(data.identifiers.map((id: string) => getIcon(id)))
    .then((res) => {
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
    .catch((error) => {
      throw error;
    });
}
export default getIconsFromServer;

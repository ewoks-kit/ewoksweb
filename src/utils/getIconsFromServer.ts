import { getIcon, getIcons } from './api';
import path from 'path-browserify';
import type { Icon } from '../types';

async function getIconsFromServer(): Promise<Icon[]> {
  const data = await getIcons();

  const icons = await Promise.all(
    data.identifiers.map((id: string) => getIcon(id))
  );

  return icons
    .filter((result) => result.data !== null)
    .map<Icon>((result) => {
      const imgbase64 = (result.data as unknown) as {
        data_url: string;
      };

      return {
        name: path.basename(result.config.url),
        image: imgbase64,
        type: path.extname(result.config.url),
      };
    });
}

export default getIconsFromServer;

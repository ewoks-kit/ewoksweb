import { assertDefined } from '../utils/typeGuards';
import type { Icon } from '../types';
import { client } from './client';
import path from 'path-browserify';
import type { DeleteResponse, IconResponse, ListResponse } from './models';
import { QueryKey } from './models';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import graphInput from 'images/graphInput.svg';
import graphOutput from 'images/graphOutput.svg';

async function fetchIconIds() {
  const { data } = await client.get<ListResponse>(`/icons`);
  return data;
}

async function fetchIcon(name: string): Promise<Icon> {
  const { config, data } = await client.get<IconResponse>(`/icon/${name}`);
  const { url } = config;
  assertDefined(url);
  return {
    data_url: data.data_url,
    name: path.basename(url),
  };
}

export async function postIcon(
  iconName: string,
  iconData: string | ArrayBuffer
) {
  const { data } = await client.post<IconResponse>(`/icon/${iconName}`, {
    data_url: iconData,
  });

  return data;
}

export async function deleteIcon(name: string) {
  const { data } = await client.delete<DeleteResponse>(`/icon/${name}`);

  return data;
}

async function getIcons(): Promise<Icon[]> {
  const { identifiers: iconNames } = await fetchIconIds();

  return Promise.all(iconNames.map(fetchIcon));
}

export function useIcons() {
  const { data: icons } = useQuery({
    queryKey: [QueryKey.Icons],
    queryFn: getIcons,
    suspense: true,
  });

  assertDefined(icons);

  return [
    ...icons,
    { name: 'graphInput.svg', data_url: graphInput },
    { name: 'graphOutput.svg', data_url: graphOutput },
  ];
}

export function useInvalidateIcons() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: [QueryKey.Icons] });
}

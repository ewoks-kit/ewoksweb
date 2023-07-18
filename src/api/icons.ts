import { assertDefined } from '../utils/typeGuards';
import type { Icon } from '../types';
import { axiosRequest } from './api';
import path from 'path-browserify';
import { Endpoint } from '@rest-hooks/rest';
import { useController, useSuspense } from '@rest-hooks/react';
import type { DeleteResponse, IconResponse, ListResponse } from './models';

async function fetchIcons() {
  const { data } = await axiosRequest.get<ListResponse>(`/icons`);
  return data;
}

async function fetchIcon(name: string): Promise<Icon> {
  const { config, data } = await axiosRequest.get<IconResponse>(
    `/icon/${name}`
  );
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
  const { data } = await axiosRequest.post<IconResponse>(`/icon/${iconName}`, {
    data_url: iconData,
  });

  return data;
}

export async function deleteIcon(name: string) {
  const { data } = await axiosRequest.delete<DeleteResponse>(`/icon/${name}`);

  return data;
}

async function getIcons(): Promise<Icon[]> {
  const { identifiers: iconNames } = await fetchIcons();

  return Promise.all(iconNames.map(fetchIcon));
}

const getIconsEndpoint = new Endpoint(getIcons);

export function useIcons() {
  const icons = useSuspense(getIconsEndpoint);

  return { icons };
}

export function useMutateIcons() {
  const ctrl = useController();

  return async () => ctrl.invalidate(getIconsEndpoint);
}

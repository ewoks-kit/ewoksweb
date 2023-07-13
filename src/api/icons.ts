import { assertDefined } from '../utils/typeGuards';
import type { Icon, IconsNames } from '../types';
import { axiosRequest } from './api';
import path from 'path-browserify';
import { Endpoint } from '@rest-hooks/rest';
import { useController, useSuspense } from '@rest-hooks/react';

interface GetIconResponse {
  data_url: string;
}

type UpdateIconResponse = GetIconResponse;

interface DeleteIconResponse {
  identifier: string;
}

async function fetchIcons() {
  const { data } = await axiosRequest.get<IconsNames>(`/icons`);
  return data;
}

async function fetchIcon(name: string): Promise<Icon> {
  const { config, data } = await axiosRequest.get<GetIconResponse>(
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
  const { data } = await axiosRequest.post<UpdateIconResponse>(
    `/icon/${iconName}`,
    {
      data_url: iconData,
    }
  );

  return data;
}

export async function deleteIcon(name: string) {
  const { data } = await axiosRequest.delete<DeleteIconResponse>(
    `/icon/${name}`
  );

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

  return () => ctrl.invalidate(getIconsEndpoint);
}

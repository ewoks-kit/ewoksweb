import { assertDefined } from '../guards';
import type { Icon, IconsNames } from '../types';
import { axiosRequest } from './api';
import path from 'path-browserify';
import useSWR from 'swr';

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

interface IconInfo extends GetIconResponse {
  url: string;
}

async function fetchIcon(name: string): Promise<IconInfo> {
  const { config, data } = await axiosRequest.get<GetIconResponse>(
    `/icon/${name}`
  );
  const { url } = config;
  assertDefined(url);
  return {
    ...data,
    url,
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

  const iconInfos = await Promise.all(iconNames.map(fetchIcon));

  return iconInfos.map<Icon>((info) => ({
    name: path.basename(info.url),
    image: info,
    type: path.extname(info.url),
  }));
}

export function useIcons() {
  const { data: icons } = useSWR('/icons', getIcons, { suspense: true });

  assertDefined(icons);
  return { icons };
}

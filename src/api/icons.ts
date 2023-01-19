import { assertDefined } from '../guards';
import type { Icon, IconsNames } from '../types';
import { axiosRequest } from './api';
import path from 'path-browserify';

interface GetIconResponse {
  data_url: string;
}

type UpdateIconResponse = GetIconResponse;

interface DeleteIconResponse {
  identifier: string;
}

export async function fetchIcons() {
  const { data } = await axiosRequest.get<IconsNames>(`/icons`);
  return data;
}

interface IconParams extends GetIconResponse {
  url: string;
}

export async function fetchIcon(id: string): Promise<IconParams> {
  const { config, data } = await axiosRequest.get<GetIconResponse>(
    `/icon/${id}`
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

export async function deleteIcon(id: string) {
  const { data } = await axiosRequest.delete<DeleteIconResponse>(`/icon/${id}`);

  return data;
}

export async function getIcons(): Promise<Icon[]> {
  const { identifiers: iconIds } = await fetchIcons();

  const icons = await Promise.all(iconIds.map((id: string) => fetchIcon(id)));

  return icons.map<Icon>((image) => ({
    name: path.basename(image.url),
    image,
    type: path.extname(image.url),
  }));
}

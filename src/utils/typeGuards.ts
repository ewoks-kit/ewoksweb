import type { AxiosError } from 'axios';
import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../types';

type EwoksServerErrorResponse = AxiosError<{
  message: string;
}>;

export function isNode(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails
): entity is EwoksRFNode {
  return 'position' in entity;
}

export function isLink(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails
): entity is EwoksRFLink {
  return 'source' in entity;
}

export function isGraphDetails(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails
): entity is GraphDetails {
  return 'input_nodes' in entity;
}

export function isEwoksServerResponseError(
  // TBD: the type of error?
  error: unknown
): error is EwoksServerErrorResponse {
  return 'message' in error.response?.data;
}

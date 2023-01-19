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
  return (
    typeof error === 'object' &&
    error !== null &&
    hasOwnProperty(error, 'response') &&
    typeof error.response === 'object' &&
    error.response !== null &&
    hasOwnProperty(error.response, 'data') &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    hasOwnProperty(error.response.data, 'message')
  );
}

function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return prop in obj;
}

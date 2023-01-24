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
  error: unknown
): error is EwoksServerErrorResponse {
  return (
    objNotNullWithProp(error, 'response') &&
    objNotNullWithProp(error.response, 'data') &&
    objNotNullWithProp(error.response.data, 'message') &&
    typeof error.response.data.message === 'string'
  );
}

function objNotNullWithProp<X, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return typeof obj === 'object' && obj !== null && prop in obj;
}

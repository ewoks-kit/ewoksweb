import { MarkerType } from 'reactflow';
import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../types';

export interface EwoksServerErrorResponse {
  response: { data: { message: string } };
}

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

export function isEwoksServerErrorResponse(
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

export function isDefined<T>(val: T): val is T extends undefined ? never : T {
  return val !== undefined;
}

export function assertDefined<T>(
  val: T,
  message = 'Expected some value'
): asserts val is T extends undefined ? never : T {
  if (!isDefined(val)) {
    throw new TypeError(message);
  }
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function assertStr(
  val: unknown,
  message = 'Expected string'
): asserts val is string {
  if (!isString(val)) {
    throw new TypeError(message);
  }
}

export function isMarkerType(val: string): val is MarkerType {
  return Object.values<string>(MarkerType).includes(val);
}

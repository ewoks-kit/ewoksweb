import { MarkerType } from 'reactflow';
import type {
  EwoksRFLink,
  EwoksRFLinkData,
  EwoksRFNode,
  EwoksRFNodeData,
  GraphDetails,
} from '../types';

export interface EwoksServerErrorResponse {
  response: { data: { message: string } };
}

export function isNode(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails | undefined
): entity is EwoksRFNode {
  return !!entity && 'position' in entity;
}

export function isLink(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails | undefined
): entity is EwoksRFLink {
  return !!entity && 'source' in entity;
}

export function isGraphDetails(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails | undefined
): entity is GraphDetails {
  return !!entity && 'input_nodes' in entity;
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

export function assertNodeDataDefined(
  nodeData: EwoksRFNodeData | undefined,
  nodeId: string
): asserts nodeData is EwoksRFNodeData extends undefined
  ? never
  : EwoksRFNodeData {
  assertDefined(nodeData, `Node with id ${nodeId} has undefined data!`);
}

export function assertEdgeDataDefined(
  edgeData: EwoksRFLinkData | undefined,
  edgeId: string
): asserts edgeData is EwoksRFLinkData extends undefined
  ? never
  : EwoksRFLinkData {
  assertDefined(edgeData, `Edge with id ${edgeId} has undefined data!`);
}

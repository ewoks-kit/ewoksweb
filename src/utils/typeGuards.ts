import { MarkerType } from '@xyflow/react';

import type { TaskInfo } from '../edition/Canvas/models';
import type { LinkData, NodeData } from '../types';

export interface EwoksServerErrorResponse {
  response: { data: { message: string } };
}

export function isEwoksServerErrorResponse(
  error: unknown,
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
  prop: Y,
): obj is X & Record<Y, unknown> {
  return typeof obj === 'object' && obj !== null && prop in obj;
}

export function isDefined<T>(val: T): val is T extends undefined ? never : T {
  return val !== undefined;
}

export function assertDefined<T>(
  val: T,
  message = 'Expected some value',
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
  message = 'Expected string',
): asserts val is string {
  if (!isString(val)) {
    throw new TypeError(message);
  }
}

export function isMarkerType(val: unknown): val is MarkerType {
  if (typeof val !== 'string') {
    return false;
  }
  return Object.values<string>(MarkerType).includes(val);
}

export function assertNodeDataDefined(
  nodeData: NodeData | undefined,
  nodeId: string,
): asserts nodeData is NodeData extends undefined ? never : NodeData {
  assertDefined(nodeData, `Node with id ${nodeId} has undefined data!`);
}

export function assertEdgeDataDefined(
  edgeData: LinkData | undefined,
  edgeId: string,
): asserts edgeData is LinkData extends undefined ? never : LinkData {
  assertDefined(edgeData, `Edge with id ${edgeId} has undefined data!`);
}

export function assertTaskInfo(
  taskInfo: unknown,
): asserts taskInfo is TaskInfo {
  if (
    !taskInfo ||
    typeof taskInfo !== 'object' ||
    !('task_identifier' in taskInfo) ||
    !('task_type' in taskInfo)
  ) {
    throw new TypeError('Expected task info');
  }
  assertStr(taskInfo.task_identifier);
  assertStr(taskInfo.task_type);
  if ('icon' in taskInfo && taskInfo.icon) {
    assertStr(taskInfo.icon);
  }
}

interface ObjectWithMessage {
  message: string;
}

interface ObjectWithRequest {
  request: string;
}

export function hasMessage(error: unknown): error is ObjectWithMessage {
  return (
    !!error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

export function hasRequest(error: unknown): error is ObjectWithRequest {
  return !!error && typeof error === 'object' && 'request' in error;
}

function isNonNull<T>(val: T): val is T extends null ? never : T {
  return val !== null;
}

export function assertNonNull<T>(
  val: T,
  message = 'Expected value to not be null',
): asserts val is T extends null ? never : T {
  if (!isNonNull(val)) {
    throw new TypeError(message);
  }
}

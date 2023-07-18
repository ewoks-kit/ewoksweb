import { client } from './client';
import { Endpoint } from '@rest-hooks/rest';
import { useController, useSuspense } from '@rest-hooks/react';
import type { filterParams } from '../types';
import type { ExecutedJobsResponse } from './models';

export async function fetchExecutionEvents(
  queryParams?: filterParams
): Promise<ExecutedJobsResponse> {
  const queryString = queryParams
    ? `?${new URLSearchParams(Object.entries(queryParams)).toString()}`
    : '';
  const { data } = await client.get<ExecutedJobsResponse>(
    `/execution/events${queryString}`
  );
  return data;
}

const getExecutionEventsEndpoint = new Endpoint(fetchExecutionEvents);

export function useExecutionEvents() {
  const executionEvents = useSuspense(getExecutionEventsEndpoint);

  return { executionEvents };
}

export function useMutateExecutionEvents() {
  const controller = useController();

  return async () => controller.invalidate(getExecutionEventsEndpoint);
}

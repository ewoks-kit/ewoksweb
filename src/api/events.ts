import { axiosRequest } from './api';
import { Endpoint } from '@rest-hooks/rest';
import { useController, useSuspense } from '@rest-hooks/react';
import type { ExecutedJobsResponse, filterParams } from '../types';

export async function getExecutionEvents(
  queryParams: filterParams
): Promise<ExecutedJobsResponse> {
  const query = new URLSearchParams(Object.entries(queryParams));
  const { data } = await axiosRequest.get<ExecutedJobsResponse>(
    `/execution/events?${query.toString()}`
  );
  return data;
}

const getExecutionEventsEndpoint = new Endpoint(getExecutionEvents);

export function useExecutionEvents(queryParams: filterParams) {
  const executionEvents = useSuspense(getExecutionEventsEndpoint, queryParams);

  return { executionEvents };
}

export function useMutateExecutionEvents() {
  const controller = useController();

  return (queryParams: filterParams) =>
    controller.invalidate(getExecutionEventsEndpoint, queryParams);
}

import { axiosRequest } from './api';
import { Endpoint } from '@rest-hooks/rest';
import { useController, useSuspense } from '@rest-hooks/react';
import type { ExecutedJobsResponse, filterParams } from '../types';

export async function getExecutionEvents(
  queryParams?: filterParams
): Promise<ExecutedJobsResponse> {
  const queryString = queryParams
    ? `?${new URLSearchParams(Object.entries(queryParams)).toString()}`
    : '';
  const { data } = await axiosRequest.get<ExecutedJobsResponse>(
    `/execution/events${queryString}`
  );
  return data;
}

const getExecutionEventsEndpoint = new Endpoint(getExecutionEvents);

export function useExecutionEvents() {
  const executionEvents = useSuspense(getExecutionEventsEndpoint);

  return { executionEvents };
}

export function useMutateExecutionEvents() {
  const controller = useController();

  return () => controller.invalidate(getExecutionEventsEndpoint);
}

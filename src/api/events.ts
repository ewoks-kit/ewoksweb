import { client } from './client';
import { useQuery } from '@tanstack/react-query';
import type { filterParams } from '../types';
import type { ExecutedJobsResponse, EwoksJob } from './models';
import { assertDefined } from '../utils/typeGuards';

async function fetchExecutionEvents(
  queryParams: filterParams | undefined
): Promise<ExecutedJobsResponse> {
  const queryString = queryParams
    ? `?${new URLSearchParams(Object.entries(queryParams)).toString()}`
    : '';
  const { data } = await client.get<ExecutedJobsResponse>(
    `/execution/events${queryString}`
  );
  return data;
}

async function getJobs(): Promise<Map<string, EwoksJob>> {
  const { jobs } = await fetchExecutionEvents(undefined);

  return new Map(jobs.map((events) => [events[0].job_id, events]));
}

export function useExecutedJobs() {
  const { data } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    suspense: true,
    staleTime: 5 * 60 * 1000, // 5mn
  });

  assertDefined(data);

  return data;
}

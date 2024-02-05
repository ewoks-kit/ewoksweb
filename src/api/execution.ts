import { useQuery } from '@tanstack/react-query';

import type { filterParams } from '../types';
import { assertDefined } from '../utils/typeGuards';
import { client } from './client';
import type { WorkersResponse } from './models';
import type { EwoksJob, ExecutedJobsResponse } from './models';
import { QueryKey } from './models';

async function fetchExecutionEvents(
  queryParams: filterParams | undefined,
): Promise<ExecutedJobsResponse> {
  const { data } = await client.get<ExecutedJobsResponse>(`/execution/events`, {
    params: queryParams,
  });
  return data;
}

async function getJobs(): Promise<Map<string, EwoksJob>> {
  const { jobs } = await fetchExecutionEvents(undefined);

  return new Map(jobs.map((events) => [events[0].job_id, events]));
}

export function useExecutedJobs() {
  const { data } = useQuery({
    queryKey: [QueryKey.Jobs],
    queryFn: getJobs,
    suspense: true,
    staleTime: 5 * 60 * 1000, // 5mn
  });

  assertDefined(data);

  return data;
}

async function getWorkers() {
  const { data } = await client.get<WorkersResponse>(`/execution/workers`);
  return data;
}

export function useWorkers() {
  const { data } = useQuery({
    queryKey: [QueryKey.Workers],
    queryFn: getWorkers,
    suspense: true,
    staleTime: Infinity,
  });
  assertDefined(data);

  return data.workers;
}

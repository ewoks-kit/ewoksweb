import { client } from './client';
import { Endpoint } from '@rest-hooks/rest';
import type { Controller } from '@rest-hooks/react';
import { useSuspense } from '@rest-hooks/react';
import type { EwoksEvent, filterParams } from '../types';
import type { ExecutedJobsResponse, EwoksJob } from './models';

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

async function getJobs(
  queryParams?: filterParams
): Promise<Map<string, EwoksJob>> {
  const { jobs } = await fetchExecutionEvents(queryParams);

  return new Map(jobs.map((events) => [events[0].job_id, events]));
}

const getJobsEndpoint = new Endpoint(getJobs, { name: 'getJobs' });

export function useExecutedJobs() {
  // `undefined` is needed to have the same cache key here and in addEventToEndpointCache
  return useSuspense(getJobsEndpoint, undefined);
}

export function addEventToEndpointCache(e: EwoksEvent, controller: Controller) {
  try {
    // The type of data gets inferred from the endpoint schema but Resthooks does not have a schema for Map
    // @ts-expect-error
    const {
      data: jobs,
    }: { data: Map<string, EwoksJob> | null } = controller.getResponse(
      getJobsEndpoint,
      undefined,
      controller.getState()
    );
    if (!jobs) {
      controller.setResponse(getJobsEndpoint, undefined, new Map());
      return;
    }
    const job = jobs.get(e.job_id) || [];
    jobs.set(e.job_id, [...job, e]);
    controller.setResponse(getJobsEndpoint, undefined, jobs);
  } catch (error) {
    controller.setError(getJobsEndpoint, undefined, error as Error);
  }
}

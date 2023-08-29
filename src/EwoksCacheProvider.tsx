import { CacheProvider } from '@rest-hooks/react';
import { useQueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import type { EwoksJob } from './api/models';
import { useSocketClientContext } from './SocketClientProvider';
import type { EwoksEvent } from './types';

interface Props {}

function EwoksCacheProvider(props: PropsWithChildren<Props>) {
  const { children } = props;
  const socket = useSocketClientContext();

  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('Executing', (e: EwoksEvent) => {
      queryClient.setQueryData(
        ['jobs'],
        (oldJobs: Map<string, EwoksJob> | undefined) => {
          if (!oldJobs) {
            return new Map<string, EwoksJob>();
          }
          const job = oldJobs.get(e.job_id) || [];
          return new Map(oldJobs).set(e.job_id, [...job, e]);
        }
      );
    });

    return () => {
      socket.off('Executing');
    };
  }, [socket, queryClient]);

  return (
    <CacheProvider managers={[...CacheProvider.defaultProps.managers]}>
      {children}
    </CacheProvider>
  );
}

export default EwoksCacheProvider;

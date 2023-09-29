import { useQueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { EwoksJob } from './api/models';
import { QueryKey } from './api/models';
import type { EwoksEvent } from './types';

export const SocketClientContext = createContext({} as Socket);

export function useSocketClientContext() {
  return useContext(SocketClientContext);
}

interface Props {
  serverUrl: string;
}

function SocketClientProvider(props: PropsWithChildren<Props>) {
  const { children, serverUrl } = props;
  const socket = io(serverUrl);

  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('Executing', (e: EwoksEvent) => {
      queryClient.setQueryData<Map<string, EwoksJob>>(
        [QueryKey.Jobs],
        (oldJobs = new Map<string, EwoksJob>()) => {
          const job = oldJobs.get(e.job_id) || [];
          return new Map(oldJobs).set(e.job_id, [...job, e]);
        }
      );
    });

    return () => {
      socket.off('Executing');
      socket.close();
    };
  }, [socket, queryClient]);

  return (
    <SocketClientContext.Provider value={socket}>
      {children}
    </SocketClientContext.Provider>
  );
}

export default SocketClientProvider;

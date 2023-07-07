import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { useMutateExecutionEvents } from './api/events';

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
  const mutateExecutionEvents = useMutateExecutionEvents();

  useEffect(() => {
    socket.on('Executing', () => {
      mutateExecutionEvents();
    });

    return () => {
      socket.disconnect();
    };
  }, [mutateExecutionEvents, socket]);

  return (
    <SocketClientContext.Provider value={socket}>
      {children}
    </SocketClientContext.Provider>
  );
}

export default SocketClientProvider;

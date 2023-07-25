import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

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

  // Close the socket when unmounting the component
  useEffect(() => {
    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketClientContext.Provider value={socket}>
      {children}
    </SocketClientContext.Provider>
  );
}

export default SocketClientProvider;

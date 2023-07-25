import type { Manager, Middleware } from '@rest-hooks/react';
import { CacheProvider } from '@rest-hooks/react';
import type { PropsWithChildren } from 'react';
import type { Socket } from 'socket.io-client';
import { addEventToEndpointCache } from './api/events';
import { useSocketClientContext } from './SocketClientProvider';
import type { EwoksEvent } from './types';

class EwoksEventManager implements Manager {
  protected middleware: Middleware;

  public constructor(protected socket: Socket) {
    this.middleware = (controller) => {
      this.socket.on('Executing', (e: EwoksEvent) => {
        addEventToEndpointCache(e, controller);
      });

      return (next) => async (action) => next(action);
    };
  }

  public getMiddleware() {
    return this.middleware;
  }

  public cleanup() {
    this.socket.off('Executing');
  }
}

interface Props {}

function EwoksCacheProvider(props: PropsWithChildren<Props>) {
  const { children } = props;
  const socket = useSocketClientContext();

  return (
    <CacheProvider
      managers={[
        ...CacheProvider.defaultProps.managers,
        new EwoksEventManager(socket),
      ]}
    >
      {children}
    </CacheProvider>
  );
}

export default EwoksCacheProvider;

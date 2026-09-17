import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { type Socket, io } from 'socket.io-client';
import { type ServerToClientEvents, type ClientToServerEvents } from "../types";

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketContextType = {
  connect: () => GameSocket;
};

const SocketContext = createContext<SocketContextType>({ connect: () => { throw new Error('SocketContext not initialised') } });

const SocketProvider = ({ children }: { children: ReactNode}) => {
  const socketRef = useRef<GameSocket | null>(null);

  // Get-or-create: the ref makes this idempotent, so however many components
  // call it, they all share one connection. Held in a ref rather than state
  // because the instance never changes identity once created, so nothing needs
  // to re-render when it appears.
  const connect = useCallback(() => {
    socketRef.current ??= io(import.meta.env.VITE_SOCKET_URL) as GameSocket;
    return socketRef.current;
  }, []);

  const value = useMemo(() => ({ connect }), [connect]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

/** The shared game socket, opening the connection on first use. */
const useSocket = (): GameSocket => useContext(SocketContext).connect();

export { SocketContext, useSocket }
export type { GameSocket }
export default SocketProvider

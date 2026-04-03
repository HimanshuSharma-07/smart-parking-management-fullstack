/**
 * Frontend Socket.io client — singleton manager.
 *
 * Usage:
 *   connectSocket()          — call after user logs in / session hydrates
 *   disconnectSocket()       — call on logout
 *   getSocket()              — get the active socket instance
 *   joinLotRoom(lotId)       — join a parking-lot specific room
 *   leaveLotRoom(lotId)      — leave a parking-lot room
 *   joinAdminRoom()          — join admin room (only works if server grants it)
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace('/api/v1', '') ||
  'http://localhost:3000';

let socket: Socket | null = null;

/** Connect to the Socket.io server. Safe to call multiple times — no-ops if already connected. */
export function connectSocket(): Socket {
  if (socket && socket.connected) return socket;

  if (socket) {
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,   // sends httpOnly cookies incl. accessToken
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
}

/** Gracefully disconnect and remove the socket instance. */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Get the current socket instance. Returns null if not connected. */
export function getSocket(): Socket | null {
  return socket;
}

/** Join a room so this client receives live events for a specific parking lot. */
export function joinLotRoom(lotId: string): void {
  socket?.emit('joinLot', lotId);
}

/** Leave a parking lot room. */
export function leaveLotRoom(lotId: string): void {
  socket?.emit('leaveLot', lotId);
}

/** Ask the server to add this socket to the admin room. */
export function joinAdminRoom(): void {
  socket?.emit('joinAdmin');
}

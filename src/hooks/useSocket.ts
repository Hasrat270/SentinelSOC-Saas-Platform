'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (tenantId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!tenantId) {
      console.log('[Socket] Waiting for tenantId to connect...');
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    if (!SOCKET_URL) {
      console.warn('[Socket] NEXT_PUBLIC_SOCKET_URL is not defined. Falling back to localhost:5000');
    }

    const url = SOCKET_URL || 'http://localhost:5000';
    console.log(`[Socket] Attempting to connect to ${url} for tenant ${tenantId}`);

    // Initialize socket connection
    const socket = io(url, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected successfully');
      
      // Join the tenant-specific room for isolated real-time alerts
      socket.emit('join-tenant', tenantId);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log(`[Socket] Disconnected: ${reason}`);
    });

    // Cleanup on unmount
    return () => {
      console.log('[Socket] Cleaning up connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [tenantId]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};

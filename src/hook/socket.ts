
import { io } from 'socket.io-client';
import { apiBaseUrl } from '../Contexts/api/axios';

export const socket = io(apiBaseUrl, {
  autoConnect: false,
  auth: (callback) => callback({ token: localStorage.getItem('lky') }),
});

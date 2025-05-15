import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Logger from '../src/utils/logger';
import Tools from '../src/utils/Tools';

const startSocketServer = (server: HttpServer) => {
  // const audioChunks: string[] = []
  Logger.server('Socket Server Started 🥙');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['*'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('upload', async (data, callback) => {
      const response = Tools.uploadAudio(data, callback, socket);
      console.log(response);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export default startSocketServer;

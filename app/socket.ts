import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Logger from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

const startSocketServer = (server: HttpServer) => {
  Logger.server('Socket Server Started 🥙');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['*'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Define the file path for saving the audio
    const recordingsDir = path.join(__dirname, 'recordings');
    const filePath = path.join(recordingsDir, `recording-${Date.now()}.webm`);

    // Ensure the recordings directory exists
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }

    // Create a writable stream for the audio file
    const fileWriter = fs.createWriteStream(filePath);

    socket.on('audio', (data) => {
      console.log('Received audio chunk');

      // Decode Base64 audio and write to the file asynchronously
      const audioBuffer = Buffer.from(data.audio, 'base64');
      fileWriter.write(audioBuffer, (err) => {
        if (err) {
          console.error('Error writing audio chunk:', err);
        }
      });
    });

    socket.on('close', (data) => {
      console.log('Stopped Recording:', data);

      // End the writable stream
      fileWriter.end(() => {
        console.log(`Recording saved to ${filePath}`);
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');

      // Ensure the writable stream is closed
      fileWriter.end(() => {
        console.log(`Recording saved to ${filePath}`);
      });
    });
  });
};

export default startSocketServer;

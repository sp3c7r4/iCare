import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Logger from '../src/utils/logger';
import fs from 'fs';

// const deepgram = createClient("ba0574fe05afe2315ac747f0796fd4aab2a2d7fe");

const startSocketServer = (server: HttpServer) => {
  Logger.server('Socket Server Started 🥙');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['*'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection', socket.id);

    const chunks: Buffer[] = [];

    socket.on('startStream', async (data) => {
      console.log('Received audio chunk');
      chunks.push(Buffer.from(data.audio, 'base64')); // Decode Base64 audio chunk
    });

    socket.on('endStream', async (data) => {
      console.log('Audio stream ended', data);

      // Combine all chunks into a single Buffer
      const audioBuffer: Buffer = Buffer.concat(chunks);

      // Write the audio buffer to an MP4 file
      const outputFilePath = 'output.mp3';
      fs.writeFileSync(outputFilePath, audioBuffer);

      console.log(`MP4 file created: ${outputFilePath}`);
      socket.emit('transcription', `Audio saved as ${outputFilePath}`);
    });
  });
};

export default startSocketServer;

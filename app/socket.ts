import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Logger from '../src/utils/logger';
import Ai from '../src/utils/Ai';

const startSocketServer = (server: HttpServer) => {
  Logger.server('Socket Server Started 🥙');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['*'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('message', (data) => {
      console.log('Received:', data);
      socket.emit('response', { message: 'Hello, client!' });
    });

    const chunks: Buffer[] = [];

    socket.on('startStream', async (data) => {
      console.log('New transcription');
      console.log('Data Type', typeof data);
      console.log('Received audio chunk:', data.audio[0]);
      chunks.push(Buffer.from(data.audio, 'base64'));
      console.log(chunks.length);
      return;
    });

    socket.on('endStream', async (data) => {
      console.log('Audio stream ended', data.message);

      // Combine all chunks into a single Buffer
      const audioBuffer = Buffer.concat(chunks);
      const base64Audio = audioBuffer.toString('base64'); // Convert Buffer to base64
      console.log(base64Audio);
      console.log('Audio buffer created');
      // Send the base64-encoded audio to Gemini
      try {
        const transcript = await Ai.audioToText(base64Audio);
        Ai.textToAudio(transcript);
        console.log('Transcription:', transcript);
        socket.emit('transcription', transcript); // Send the transcription back to the client
      } catch (error) {
        console.error('Error processing audio stream:', error);
        socket.emit('transcription', 'Error processing audio stream');
      }
    });
  });
};

export default startSocketServer;

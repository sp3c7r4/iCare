import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Logger from '../src/utils/logger';
import env from '../src/config/env';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import Ai from '../src/utils/AiClass';

const startSocketServer = (server: HttpServer) => {
  Logger.server('Socket Server Started 🥙');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['*'],
    },
  });

  const apiKey = env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    safetySettings,
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
      console.log('Received audio chunk:', data.audio[0]);
      chunks.push(Buffer.from(data.audio, 'base64')); // Convert base64 chunk to Buffer
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
      Ai.textToAudio("Hello, I'm Alexa.");
      // Send the base64-encoded audio to Gemini
      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Audio,
              mimeType: 'audio/wav',
            },
          },
          { text: 'Generate a transcript of the speech.' },
        ]);

        const transcript = result.response.text();
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

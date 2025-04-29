import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Logger from '../src/utils/logger';
import fs from 'fs';
import path from 'path';
import { createDirectory } from '../src/utils/utility';
import AwsTools from '../src/utils/AwsTools';

async function uploadAudio(data, callback) {
  const { file, fileName } = data;

  if (!file || !fileName) {
    callback({ success: false, error: 'Invalid file or fileName' });
    return;
  }

  // Decode Base64 and save the file
  const recordingsDir = createDirectory('recordings');
  const filePath = path.join(recordingsDir, fileName);
  const buffer = Buffer.from(file, 'base64');

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      callback({ success: false, error: 'Failed to save file' });
    } else {
      console.log('File saved successfully:', filePath);
      callback({ success: true });
    }
  });
  const transcribe = await AwsTools.audioTranscribe2(filePath);
  console.log(
    'Transcribe: ',
    transcribe?.results.channels[0].alternatives[0].transcript,
  );
  return transcribe?.results.channels[0].alternatives[0].transcript;
}

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
      const response = uploadAudio(data, callback);
      console.log(response);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export default startSocketServer;

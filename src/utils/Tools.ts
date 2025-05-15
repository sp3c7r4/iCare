import env from "../config/env"
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming"
import { createReadStream, readFileSync, type PathLike } from "fs"
import { createClient } from "@deepgram/sdk";
import { createDirectory } from "./utility";
import path from "path";
import fs from 'fs'


class Tool {
  private access_key
  private secret_key
  private deepgram_key
  private deepgram;

  constructor() {
    this.access_key = env.AMAZON_ACCESS_KEY;
    this.secret_key = env.AMAZON_SECRET_KEY;
    this.deepgram_key = env.DEEPGRAM;
    this.deepgram = createClient(this.deepgram_key);
  }

  private errMsg = {
    nanSpeech: "Transcription failed: No audible speech detected in the audio file.",
    nanAudio: "Transcription failed: No audio file detected.",
    errSaveFile: "Failed to save file.",
    // err
  }
  
  async audioTranscribe(path: PathLike, array: string[]) {
    const audio = createReadStream(path, { highWaterMark: 1024 * 16});
    
    const LanguageCode = "en-US";
    const MediaEncoding = "pcm";
    const MediaSampleRateHertz = "16000";
    const credentials = { "accessKeyId": this.access_key, "secretAccessKey": this.secret_key };
    async function startRequest() {
      const client = new TranscribeStreamingClient({ region: "us-west-2", credentials });
    
      const params = {
        LanguageCode,
        MediaEncoding,
        MediaSampleRateHertz,
        AudioStream: (async function* () {
          for await (const chunk of audio) {
            yield {AudioEvent: {AudioChunk: chunk}};
          }
        })(),
      };
      const command = new StartStreamTranscriptionCommand(params);
      // Send transcription request
      const response = await client.send(command);

      try {
        for await (const event of response.TranscriptResultStream) {
          console.log(JSON.stringify(event))
          array.push(JSON.stringify(event));
        }
      } catch(err) {
        console.log("error")
        console.log(err)
      }
    }
    startRequest();
  }

  async audioTranscribe2(path: PathLike) {
    try {
      const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(
        readFileSync(path),
        {
          model: "nova-3",
        }
      );
      if (error) {
        throw new Error(this.errMsg.nanSpeech);
      }
      const output = result?.results.channels[0].alternatives[0].transcript
      if(!output) throw new Error(this.errMsg.nanSpeech)
      return output
    } catch(e: any) {
      throw new Error(e)
    }
  }

  async sentimentAnalysis() {
    
  }

  async uploadAudio(data:any, callback: (value: any) => void, socket: any) {
    const { file, fileName } = data;
  
    if (!file || !fileName) {
      callback({ success: false, error: 'Invalid file or fileName' });
      return;
    }
    try {
      // Decode Base64 and save the file
      const recordingsDir = createDirectory('recordings');
      const filePath = path.join(recordingsDir, fileName);
      const buffer = Buffer.from(file, 'base64');
    
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error('Error saving file:', err);
          throw new Error(this.errMsg.errSaveFile)
        } else {
          console.log('File saved successfully:', filePath);
        }
      });
      console.log(filePath)
      const transcribe = await this.audioTranscribe2(filePath);
      console.log( 'Transcribe: ', transcribe );
      callback({ success: true, message: transcribe });
      return transcribe;
    } catch(e: any) {
      console.log(e)
      callback({success: true, msg: 'invalidSpeech' })
      console.log("LOGGED ERROR")
      // callback({ success: true, message: e})
    }

  }
}

const Tools = new Tool()
export default Tools;
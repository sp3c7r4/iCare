import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import env from "../config/env";
import { writeFile } from "fs/promises";

const pollyClient = new PollyClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AMAZON_ACCESS_KEY,
    secretAccessKey: env.AMAZON_SECRET_KEY,
  },
});

const client = new TranscribeStreamingClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AMAZON_ACCESS_KEY,
    secretAccessKey: env.AMAZON_SECRET_KEY,
  },
});

export default class SpeechProcessing {
  private voiceId;
  private outputFormat;
  private outputFilePath;

  constructor() {
    this.voiceId = "Joanna"
    this.outputFormat = "mp3"
    this.outputFilePath = "./audio/output.mp3"
  }

  async textToSpeech(Text: string) {
    const params = {
      Text,
      OutputFormat: this.outputFormat,
      VoiceId: this.voiceId,
    };

    try {
      // @ts-ignore
      const command = new SynthesizeSpeechCommand(params);
      const response = await pollyClient.send(command);
    
      if (response.AudioStream) {
        // Save the audio stream to a file
        const audioBuffer = Buffer.from(await response.AudioStream.transformToByteArray());
        // const base64Audio = audioBuffer.toString('base64');
        await writeFile(this.outputFilePath, audioBuffer);
        console.log(`Audio saved to ${this.outputFilePath}`);
        return this.outputFilePath;
      } else {
        throw new Error("No audio stream returned from Polly.");
      }
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      throw error;
    }
  }

  async speechToText() {
    
  }
}
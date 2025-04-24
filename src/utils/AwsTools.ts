import env from "../config/env"
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming"
import { createReadStream, readFileSync, type PathLike } from "fs"
import { createClient } from "@deepgram/sdk";


class Tools {
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
    const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(
      readFileSync(path),
      {
        model: "nova-3",
      }
    );
    if (error) {
      console.error(error);
    }
    return result
  }

  async sentimentAnalysis() {
    
  }
  }

const AwsTools = new Tools()
export default AwsTools;
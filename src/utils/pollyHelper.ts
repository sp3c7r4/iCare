import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import env from "../config/env";
import { writeFile } from "fs/promises";

const pollyClient = new PollyClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AMAZON_ACCESS_KEY,
    secretAccessKey: env.AMAZON_SECRET_KEY,
  },
});

export const synthesizeSpeech = async (text: string, voiceId: string = "Joanna", outputFormat: string = "mp3", outputFilePath: string = "./output.mp3") => {
  const params = {
    Text: text,
    OutputFormat: outputFormat,
    VoiceId: voiceId,
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    if (response.AudioStream) {
      // Save the audio stream to a file
      const audioBuffer = Buffer.from(await response.AudioStream.transformToByteArray());
      const base64Audio = audioBuffer.toString('base64');
      console.log("Base64 Audio:", base64Audio);
      await writeFile(outputFilePath, audioBuffer);
      console.log(`Audio saved to ${outputFilePath}`);
      return outputFilePath;
      // console.log(await response.AudioStream.transformToString())
    } else {
      throw new Error("No audio stream returned from Polly.");
    }
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
};
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import env from "../config/env";
import ChatRepository from "../repositories/chat.repository";
import { synthesizeSpeech } from "./pollyHelper";

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
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  }
];

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default class Ai {
  input: string;
  user_id: string

  constructor (input: string, user_id: string) {
    this.input = input
    this.user_id = user_id
  }

  async fetchChatHistory(): Promise<{user: string, model: string, timestamp: Date}[] | []> {
    return await ChatRepository.readChatsById(this.user_id);
  }

  async generateResponse() {
    const fetchChatHistory = await this.fetchChatHistory()
    console.log(fetchChatHistory)
    const history = fetchChatHistory.flatMap(({ user, model }) => [
      { role: "user", parts: [{ text: user }] },
      { role: "model", parts: [{ text: model }] },
    ]);
    const chatSession = model.startChat({ 
      generationConfig,
      history
    });
    const result = await chatSession.sendMessage(this.input);
    return result.response.text();
  }

  static async audioToText(data: string) {
    console.log(typeof data)
    // Send audio to Gemini AI for transcription
    const result = await model.generateContent([
        { inlineData: { mimeType: "audio/webm", data } }, { text: 'Generate a transcript of the speech.' }
    ]);

    const transcript = result.response.text();
    console.log(transcript)
    return transcript;
  }

  static async textToAudio(text: string) {
    return await synthesizeSpeech(text)
  }

  makeDecision() { }

}


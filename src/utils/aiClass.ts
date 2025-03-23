import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import env from "../config/env";
import ChatRepository from "../repositories/chat.repository";

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

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();

export default class Ai {
  input: string;

  constructor (input: string) {
    this.input = input
  }

  async fetchChatHistory(): Promise<object[]> {
    return await ChatRepository.readAllChats();
  }

  async generateResponse() {
    const fetchChatHistory = await this.fetchChatHistory()
    const chatSession = model.startChat({ 
      generationConfig,
      history: fetchChatHistory.map((output: {role: string, text: string}) => ({
      role: output.role,
      parts: [{ text: output.text }],
      })),
    });
    const result = await chatSession.sendMessageStream("Tell me the nigerian national anthem");
    for await(const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
    }
  }

  makeDecision() {

  }

}


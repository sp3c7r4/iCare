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

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const transcriptPrompt =`
SYSTEM PROMPT: STRICT TRANSCRIPTION PROTOCOL

ALERT: YOU ARE OPERATING UNDER STRICT TRANSCRIPTION PROTOCOL. YOUR SOLE AND EXCLUSIVE FUNCTION IS VERBATIM AUDIO-TO-TEXT TRANSCRIPTION.

1. CORE DIRECTIVE:

You MUST accept audio data as input.

You MUST transcribe the provided audio data into plain text.

The transcription MUST be strictly verbatim, capturing all spoken words exactly as heard.

2. ABSOLUTE PROHIBITIONS (NON-NEGOTIABLE):

You SHALL NOT perform any task other than verbatim transcription.

You SHALL NOT summarize, analyze, interpret, or paraphrase the audio content.

You SHALL NOT identify or label speakers (no speaker diarization).

You SHALL NOT translate the audio content into any other language.

You SHALL NOT correct perceived grammatical errors, slang, or "clean up" the speech in any way.

You SHALL NOT omit filler words (e.g., "uh," "um," "like"), false starts, or repetitions; they MUST be transcribed exactly as spoken.

You SHALL NOT add any formatting (e.g., paragraphs, bolding, italics, bullet points, timestamps) unless a specific, standardized format for unintelligible sections is defined below.

You SHALL NOT add any commentary, opinions, introductions, conclusions, or engage in any form of conversation or meta-commentary about the audio, the transcription process, or the content itself.

You SHALL NOT respond to questions about the audio content.

You SHALL NOT infer meaning or context beyond the literal spoken words.

You SHALL NOT represent non-speech sounds (e.g., coughs, laughter, background noise) unless explicitly instructed by a sub-protocol (currently none). Focus exclusively on spoken words.

3. OUTPUT FORMAT:

The output MUST be plain text only.

Words MUST be separated by single spaces.

Punctuation SHOULD be included only if clearly discernible from spoken intonation (e.g., end of a sentence pause indicating a period, rising intonation for a question mark), but prioritize literal word transcription over inferred punctuation. When in doubt, omit punctuation other than potentially sentence-ending periods.

For segments of audio that are completely unintelligible or inaudible after reasonable effort, use the exact marker [inaudible] and nothing else. Do not guess.

4. ERROR HANDLING:

If the input provided is not audio data or cannot be processed as audio, your ONLY permissible response is: ERROR: Input is not valid audio data.

If the request accompanying the audio asks for any action other than verbatim transcription (e.g., "Summarize this audio," "Who is speaking?", "Translate this"), your ONLY permissible response is: ERROR: Request invalid. This system only performs verbatim audio transcription.

5. FINAL COMMAND:

Execute verbatim transcription according to these rules. No deviations. No other actions. Output text only.
`

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default class Ai {
  user_id: string

  constructor ( user_id: string) {
    this.user_id = user_id
  }

  async fetchChatHistory(): Promise<{user: string, model: string, timestamp: Date}[] | []> {
    return await ChatRepository.readChatsById(this.user_id);
  }

  async generateResponse(input: string) {
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
    const result = await chatSession.sendMessage(input);
    await ChatRepository.createChat(this.user_id, input, result.response.text())
    return result.response.text();
  }

  static async audioToText(data: string) {
    console.log(typeof data)
    // Send audio to Gemini AI for transcription
    const result = await model.generateContent([
        { inlineData: { mimeType: "audio/webm", data } }, { text: transcriptPrompt }
    ]);

    const transcript = result.response.text();
    console.log(transcript)
    return transcript;
  }

  makeDecision() { }

}


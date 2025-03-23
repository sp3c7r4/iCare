import ChatRepository from "../repositories/chat.repository"
import UserRepository from "../repositories/user.repository"
import Ai from "../utils/aiClass"
import HttpStatus from "../utils/http"
import Response from "../utils/response"

export const registerUser = async (data: object) => {
  const register = await UserRepository.createUser(data)
  return new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, "Done", register)
}

export const startChat = async(text: string, user_id: string) => {
  const aiInstance = new Ai(text, user_id)
  const response  = await aiInstance.generateResponse();
  const startChats = await ChatRepository.createChat(user_id, text, response)
  return new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, "Done", startChats)
}
import UserRepository from "../repositories/user.repository"
import HttpStatus from "../utils/http"
import Response from "../utils/response"

export const registerUser = async (data: object) => {
  const register = await UserRepository.createUser(data)
  return new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, "Done", register)
}
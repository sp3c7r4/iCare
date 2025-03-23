import type { UserResponseDTO } from "../dto/user.dto";
import type { IUser } from "../types/User.type";

export default function(model: IUser): UserResponseDTO {
  return {
    id: model.id,
    firstname: model.firstname,
    lastname: model.lastname,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    email: model.email,
  }
}
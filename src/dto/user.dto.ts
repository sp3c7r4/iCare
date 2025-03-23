export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string; 
}

export interface UserResponseDTO {
  id: string; 
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date; 
  updatedAt: Date; 
}
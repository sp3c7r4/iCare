import BaseRepositorySQL from "./baseRepositorySQL";
import User from "../models/user.model";

export default class UserRepository extends BaseRepositorySQL {
  constructor() {
    super(User)
  }
}
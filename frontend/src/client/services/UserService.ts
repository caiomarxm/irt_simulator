import { httpClient } from "../core/httpClient";
import { UserPublic } from "../models/user";

export class UserService {
  public static readUserMe() : Promise<UserPublic> {
    return httpClient.get(
        "/users/me"
    )
  }
}

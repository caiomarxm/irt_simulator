import { AxiosPromise } from "axios";
import { httpClient } from "../core/httpClient";
import { UserPublic } from "../models/user";

export class UserService {
  public static readUserMe() : AxiosPromise<UserPublic> {
    return httpClient.get(
        "/users/me"
    )
  }
}

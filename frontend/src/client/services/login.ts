import { httpClient } from "../core/httpClient";
import {
  AccessTokenRequestBody,
  AccessTokenResponseBody,
} from "../models/token";

export type LoginFormData = {
  formData: AccessTokenRequestBody;
};

export class LoginService {
  public static async loginAccessToken(
    data: LoginFormData
  ): Promise<AccessTokenResponseBody> {

    return httpClient.postForm("/login/token", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }
}

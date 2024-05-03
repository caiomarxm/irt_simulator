import { httpClient } from "../core/api";
import { AccessTokenRequestBody } from "../models/token";

export type TDataLoginAccessToken = {
  formData: AccessTokenRequestBody;
};

export class LoginService {
  public static async loginAccessToken(data: TDataLoginAccessToken) {

    return httpClient.postForm(
        "/login/token",
        data,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )
  }
}

import { AxiosPromise } from "axios";
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
  ): AxiosPromise<AccessTokenResponseBody> {

    return httpClient.postForm("/login/token", data.formData);
  }
}

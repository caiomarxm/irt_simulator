import { AxiosPromise } from "axios";
import { httpClient } from "../core/httpClient";
import { ISubmission, ISubmissionPost } from "../models/submission";

export class SubmissionService {
  public static listSubmissions(
    year: number | null = null,
    includeAnswers: boolean = false,
    ignoreSuperuser: boolean = true
  ): AxiosPromise<ISubmission[]> {
    let filters: string = `ignore_superuser=${ignoreSuperuser}&include_answers=${includeAnswers}`;

    if (year) {
      filters += `&year=${year}`;
    }

    return httpClient.get(`/submissions?${filters}`);
  }

  public static submitExam(
    submission: ISubmissionPost
  ): AxiosPromise<ISubmission> {
    return httpClient.post(`/submissions/submit`, submission);
  }
}

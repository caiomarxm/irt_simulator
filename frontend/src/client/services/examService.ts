import { AxiosPromise } from "axios";
import { httpClient } from "../core/httpClient";
import { IExam } from "../models/exam";

export class ExamService {
  public static listExams(year: number|null = null, includeQuestions: boolean = false) : AxiosPromise<IExam> {
    let filters: string = `include_questions=${includeQuestions}`

    if (year) {
      filters += `&year=${year}`
    }

    return httpClient.get(
        `/exams?${filters}`
    )
  }

  public static openExam(id: number): AxiosPromise<IExam> {
    return httpClient.put(
      `/exams/${id}`,
      {is_closed: false}
    )
  }

  public static closeExam(id: number): AxiosPromise<IExam> {
    return httpClient.put(
      `/exams/${id}`,
      {is_closed: true}
    )
  }

  public static commitExam(id: number): AxiosPromise<IExam> {
    return httpClient.post(
      `/exams/${id}/commit`,
      {is_closed: true, is_committed: true}
    )
  }
}

import { AxiosPromise } from "axios";
import { httpClient } from "../core/httpClient";
import { Exam } from "../models/exam";

export class ExamService {
  public static listExams(year: number|null = null, includeQuestions: boolean = false) : AxiosPromise<Exam> {
    let filters: string = `include_questions=${includeQuestions}`

    if (year) {
      filters += `&year=${year}`
    }

    return httpClient.get(
        `/exams?${filters}`
    )
  }
}

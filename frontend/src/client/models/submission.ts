import { IAnswer } from "./answer";

export interface ISubmission {
  id: number | undefined | null;
  user_id: number | undefined | null;
  exam_id: number | undefined | null;
  is_commited: boolean | undefined;
  answers: IAnswer[] | null;
}

export interface ISubmissionPost extends ISubmission {
  exam_year: number;
}

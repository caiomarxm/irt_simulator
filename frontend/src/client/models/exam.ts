import { IQuestion } from "./question"

export interface IExam {
    id: number,
    year: number,
    is_closed: boolean,
    is_committed: boolean,
    questions: IQuestion[]
}

import { IQuestion } from "./question"

export type Exam = {
    id: number,
    year: number,
    is_closed: boolean,
    is_commited: boolean,
    questions: IQuestion[]
}

import { Dispatch } from "react";
import { IAnswer } from "../../client/models/answer";
import { IQuestion } from "../../client/models/question";
import { Question } from "./Question";

interface QuestionRendererProps {
  questions: IQuestion[];
  answers: IAnswer[];
  setAnswers: Dispatch<React.SetStateAction<IAnswer[]>>;
  isSubmissionCommitted: boolean | undefined;
}

export const QuestionsRenderer = ({
  questions,
  answers,
  setAnswers,
  isSubmissionCommitted,
}: QuestionRendererProps) => {
  return (
    <>
      {questions.map((item, i) => (
        <Question
          key={item.id}
          index={i + 1}
          questionId={item.id}
          question={item.question}
          options={item.options}
          answers={answers}
          setAnswers={setAnswers}
          isSubmissionCommitted={isSubmissionCommitted}
        />
      ))}
    </>
  );
};

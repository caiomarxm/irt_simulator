import { ReactNode, createContext } from "react";
import { IExam } from "../client/models/exam";
import { ISubmission, ISubmissionPost } from "../client/models/submission";
import { useCurrentExam } from "../hooks/useCurrentExam";
import { useSubmission } from "../hooks/useSubmission";
import { UseMutationResult } from "@tanstack/react-query";

export interface ICurrentExamQueryData {
  data: IExam;
  isLoading: boolean;
  isOpenForSubmission: boolean;
  isExamCommitted: boolean;
  currentYear: number;
}

export interface ISubmissionQueryData {
  data: ISubmission;
  isLoading: boolean;
  refetch: () => void;
  submissionMutation: UseMutationResult<void, Error, ISubmissionPost, unknown>;
}

export interface IQuizContext {
  exam: ICurrentExamQueryData;
  submission: ISubmissionQueryData;
}

interface QuizContextProps {
  children: ReactNode;
}

export const QuizContext = createContext<IQuizContext | null>(null);

export const QuizContextProvider = ({ children }: QuizContextProps) => {
  const { data, isLoading, currentYear } = useCurrentExam();

  const {
    data: formData,
    isLoading: formIsLoading,
    refetch,
    submissionMutation,
  } = useSubmission();

  const quizContext = {
    exam: {
      data: data,
      isLoading: isLoading,
      isOpenForSubmission: !data?.is_closed,
      isExamCommitted: data?.is_committed,
      currentYear: currentYear,
    },
    submission: {
      data: formData,
      isLoading: formIsLoading,
      refetch: refetch,
      submissionMutation: submissionMutation,
    },
  } as unknown as IQuizContext;

  return (
    <QuizContext.Provider value={quizContext}>{children}</QuizContext.Provider>
  );
};

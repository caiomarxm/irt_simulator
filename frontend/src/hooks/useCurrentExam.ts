import { useQuery } from "@tanstack/react-query";
import { ExamService } from "../client/services/examService";
import { useState } from "react";

export const useCurrentExam = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const query = useQuery({
    queryKey: ["list-exams"],
    queryFn: async () => await ExamService.listExams(currentYear, true),
  });

  const [isOpenForSubmission] = useState<boolean>(
    !(query.data?.data.is_closed)
  )

  const [isExamCommitted] = useState<boolean>(
    query.data?.data.is_committed
  )

  return {
    ...query,
    data: query.data?.data,
    setCurrentYear,
    isOpenForSubmission,
    isExamCommitted,
    currentYear
  };
};

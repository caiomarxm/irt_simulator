import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExamService } from "../client/services/examService";
import { useState } from "react";

export const useCurrentExam = () => {
  const queryClient = useQueryClient()

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const query = useQuery({
    queryKey: ["list-exams"],
    queryFn: async () => await ExamService.listExams(currentYear, true),
  });

  const openExamMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await ExamService.openExam(id)
      queryClient.invalidateQueries({ queryKey: ["list-exams"] });
      return result
    },
  });

  const closeExamMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await ExamService.closeExam(id)
      queryClient.invalidateQueries({ queryKey: ["list-exams"] });
      return result
    },
  });

  const commitExamMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await ExamService.commitExam(id)
      queryClient.invalidateQueries({ queryKey: ["list-exams"] });
      return result
    },
  });


  return {
    ...query,
    data: query.data?.data,
    setCurrentYear,
    currentYear,
    openExamMutation,
    closeExamMutation,
    commitExamMutation
  };
};

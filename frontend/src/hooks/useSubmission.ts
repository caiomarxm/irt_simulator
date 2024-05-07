import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubmissionService } from "../client/services/submissionService";
import { ISubmissionPost } from "../client/models/submission";

export const useSubmission = () => {
  const queryClient = useQueryClient();

  const [currentYear] = useState<number>(new Date().getFullYear());

  const query = useQuery({
    queryKey: ["submissions"],
    queryFn: () => SubmissionService.listSubmissions(currentYear, true),
  });

  const submissionMutation = useMutation({
    mutationFn: async (submission: ISubmissionPost) => {
      const result = await SubmissionService.submitExam(submission);
      queryClient.invalidateQueries({queryKey: ["submissions"]});
      return result
    },
  });

  return {
    ...query,
    isLoading: query.isLoading,
    refetch: query.refetch,
    data: query.data?.data[0],
    submissionMutation,
  };
};

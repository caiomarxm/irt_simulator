import {
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Quiz } from "../components/quiz/Quiz";
import { useCurrentExam } from "../hooks/useCurrentExam";
import { useQuery } from "@tanstack/react-query";
import { SubmissionService } from "../client/services/submissionService";
import { IAnswer } from "../client/models/answer";

export const ExamPage = () => {
  const { data, isLoading, isOpenForSubmission, isExamCommitted, currentYear } =
    useCurrentExam();


  const { data: formData, isLoading: formIsLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: () => SubmissionService.listSubmissions(currentYear, true),
  });

  const axiosData = formData?.data ?? [];

  const isSubmissionCommitted =
    axiosData?.length > 0 ? axiosData[0].is_commited : false;
  const answers = axiosData?.length > 0 ? axiosData[0].answers : [];


  if (isLoading || formIsLoading) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Current Exam</Tab>
          <Tab>Take the Quiz!</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Text mb={5}>Some informational data about the quiz here</Text>
            {isOpenForSubmission && !isExamCommitted ? (
              <Text>Looks like the quiz is open for submission!</Text>
            ) : (
              <></>
            )}
          </TabPanel>

          <TabPanel>
            <Quiz
              isOpenForSubmition={isOpenForSubmission}
              questions={data?.questions}
              currentYear={currentYear}
              isSubmissionCommitted={isSubmissionCommitted}
              initialAnswers={answers as IAnswer[]}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

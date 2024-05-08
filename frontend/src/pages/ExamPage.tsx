import {
  Divider,
  Flex,
  Heading,
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
import { QuizContextProvider } from "../context/QuizContextProvider";
import { useSubmission } from "../hooks/useSubmission";

export const ExamPage = () => {
  const { isLoading, data } = useCurrentExam();

  const isOpenForSubmission = !data?.is_closed;

  const { isLoading: formIsLoading, data: formData } = useSubmission();

  let text: string = "";

  if (isOpenForSubmission && !data?.is_committed) {
    if (!formData?.is_commited) {
      text = "Looks like the quiz is open for submission!";
    } else {
      text =
        "Looks like you already took the quiz. The results will be available soon.";
    }
  }

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
            <Heading as="h3" fontSize="1.2rem" mb={5}>NHE - National Highschool Exam.</Heading>
            <Text>This exam is a quiz composed of 10 objective questions.</Text>
            <Text>You can save your progress and leave at anytime while the exam is open for submission.</Text>
            <Text mb={5}>But keep in mind that you can only submit the exam once.</Text>
            <Divider />
            <Text>{text}</Text>
          </TabPanel>

          <TabPanel>
            <QuizContextProvider>
              <Quiz />
            </QuizContextProvider>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

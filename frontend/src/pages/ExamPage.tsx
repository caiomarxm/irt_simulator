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
            <Text mb={5}>Some informational data about the quiz here</Text>
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

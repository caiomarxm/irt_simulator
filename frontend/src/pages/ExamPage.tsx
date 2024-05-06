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
import { useEffect } from "react";
import { useCurrentExam } from "../hooks/useCurrentExam";

export const ExamPage = () => {
  const { data, isLoading, isOpenForSubmission, currentYear } = useCurrentExam();

  // TODO: useEffect to see if the quizz is currently available to submissions
  useEffect(() => {}, []);

  if (isLoading) {
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
            {isOpenForSubmission ? (
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
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { Quiz } from "../components/quiz/Quiz";
import { useEffect, useState } from "react";

export const ExamPage = () => {
  const [isOpenForSubmission, setIsOpenForSubmission] = useState<boolean>(false)

  // TODO: useEffect to see if the quizz is currently available to submissions
  useEffect(() => {
    setIsOpenForSubmission(true)
  }, [])

  // TODO: fetch if user already took the quizz and submitted any anwers

  return (
    <>
      <Button onClick={() => {setIsOpenForSubmission(!isOpenForSubmission)}}>Change Open (Temporary)</Button>
      <Tabs>
        <TabList>
          <Tab>Current Exam</Tab>
          <Tab>Take the Quizz!</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Text>
              Some informational data about the quizz here
            </Text>
            { isOpenForSubmission ? <Text>Looks like the quizz is open for submission!</Text> : <></> }
          </TabPanel>

          <TabPanel>
            <Quiz isOpenForSubmition={isOpenForSubmission} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

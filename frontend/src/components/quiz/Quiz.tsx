import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { Question } from "./Question";
import { IQuestion } from "../../client/models/question";
import {
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { IAnswer } from "../../client/models/answer";
import { ISubmissionPost as ISubmissionPostData } from "../../client/models/submission";
import { SubmissionService } from "../../client/services/submissionService";
import { UserPublic } from "../../client/models/user";
import ConfirmationModal from "./ConfirmationModal";
import { CheckCircleIcon } from "@chakra-ui/icons";

type QuizProps = {
  isOpenForSubmition: boolean;
  questions?: IQuestion[];
  currentYear: number;
};

export const Quiz = ({
  isOpenForSubmition,
  questions,
  currentYear,
}: QuizProps) => {
  // States used by the Quizz
  const [answers, setAnswers] = useState([] as IAnswer[]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Hooks
  const toast = useToast();

  // Use Effect to render previous answers and if submit was commited!!!
  useEffect(() => {}, []);

  // Submit and Save handlers
  const saveAnswers = async (submission: ISubmissionPostData) => {
    const result = await SubmissionService.submitExam(submission);

    return result;
  };

  const generateSubmissionPostData = (isCommited: boolean = false) => {
    const userDataString = localStorage.getItem("userData");
    let userData;
    if (userDataString) {
      userData = JSON.parse(userDataString) as UserPublic;
    }

    return {
      exam_year: currentYear,
      user_id: userData?.id,
      is_commited: isCommited,
      answers: answers,
    } as ISubmissionPostData;
  };

  const handleClickOnSave: MouseEventHandler<HTMLButtonElement> = async () => {
    const submissionPostData = generateSubmissionPostData(false);
    const result = await saveAnswers(submissionPostData);

    if ([200, 201].includes(result.status)) {
      toast({
        colorScheme: "green",
        description: `Your quiz was saved successfully, you can come back and finish it later!`,
        title: `Congratulations!`,
        position: "top",
        icon: <CheckCircleIcon />,
      });
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    onOpen();

    // const submissionPostData = generateSubmissionPostData(true);
    // const result = await saveAnswers(submissionPostData);

    // if ([200, 201].includes(result.status)) {
    //   toast({
    //     colorScheme: "green",
    //     description: `You've submitted your quiz successfully and your results will be available any time.`,
    //     title: `Congratulations!`
    //   })
    // }
  };

  // Building the component

  if (!isOpenForSubmition) {
    return (
      <Box>
        <Heading as="h2" fontSize="1.5em" mb={5}>
          You are here too early!
        </Heading>
        <Text>Looks like the quiz isn't available for submissions yet</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Form method="POST" onSubmit={handleSubmit}>
        <Heading as="h2" fontSize="1.5em" mb={5}>
          Here's the quiz!
        </Heading>
        <Text mb={5}>
          Please keep in mind that you can only submit this quiz once.
        </Text>
        <Divider mb={5} />
        {questions?.map((item, i) => (
          <Question
            key={item.id}
            index={i + 1}
            questionId={item.id}
            question={item.question}
            options={item.options}
            answers={answers}
            setAnswers={setAnswers}
          />
        ))}
        <HStack spacing={5}>
          <Button colorScheme="green" type="submit">
            Submit
          </Button>
          <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
          />
          <Button onClick={handleClickOnSave}>Save</Button>
        </HStack>
      </Form>
    </Box>
  );
};

import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { Question } from "./Question";
import { IQuestion } from "../../client/models/question";
import {
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
  useState,
} from "react";
import { IAnswer } from "../../client/models/answer";
import { ISubmissionPost as ISubmissionPostData } from "../../client/models/submission";
import { SubmissionService } from "../../client/services/submissionService";
import { UserPublic } from "../../client/models/user";
import ConfirmationModal from "./ConfirmationModal";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { AxiosError } from "axios";
import useCustomToast from "../../hooks/useCustomToast";

type QuizProps = {
  isOpenForSubmition: boolean;
  questions?: IQuestion[];
  currentYear: number;
  isSubmissionCommitted: boolean | undefined;
  initialAnswers: IAnswer[];
};

export const Quiz = ({
  isOpenForSubmition,
  questions,
  currentYear,
  isSubmissionCommitted,
  initialAnswers,
}: QuizProps) => {
  // States used by the Quizz
  const [answers, setAnswers] = useState(initialAnswers as IAnswer[]);
  const { isOpen, onOpen: openConfirmationModal, onClose } = useDisclosure();

  // Hooks
  const { errorToast, unknownErrorToast, successToast } = useCustomToast();

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

    try {
      await saveAnswers(submissionPostData);
      successToast(
        `Congratulations!`,
        `Your quiz was saved successfully, you can come back and finish it later!`,
        <CheckCircleIcon />
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        errorToast(
          "Invalid request",
          "You cannot overwrite an already submited exam.",
          <WarningIcon />
        );
      } else {
        unknownErrorToast();
      }
    }
  };

  const submitAnswers = async () => {
    const submissionPostData = generateSubmissionPostData(true);
    try {
      const result = await saveAnswers(submissionPostData);
      if ([200, 201].includes(result.status)) {
        successToast(
          `Submitted!`,
          `Your quiz was submitted successfully`,
          <CheckCircleIcon />
        );
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        errorToast(
          "Invalid request",
          "You cannot overwrite an already submited exam.",
          <WarningIcon />
        );
      } else {
        unknownErrorToast();
      }
    }
  };

  const handleClickOnSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent
  ) => {
    event.preventDefault();
    openConfirmationModal();
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
      <Form method="POST" onSubmit={handleClickOnSubmit}>
        <Heading as="h2" fontSize="1.5em" mb={5}>
          Here's the quiz!
        </Heading>
        <Box display={isSubmissionCommitted ? "none" : ""}>
          <Text mb={5}>
            Please keep in mind that you can only submit this quiz once.
          </Text>
        </Box>
        <Box display={!isSubmissionCommitted ? "none" : ""}>
          <Text mb={5}>
            You've already submitted a response to this exam. You can still see your responses, but you won't be able to edit them.
          </Text>
        </Box>
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
            isCommited={isSubmissionCommitted}
          />
        ))}
        <HStack spacing={5}>
          <Button
            colorScheme="green"
            type="submit"
            display={isSubmissionCommitted ? "none" : ""}
          >
            Submit
          </Button>
          <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={openConfirmationModal}
            submitFn={submitAnswers}
          />
          <Button
            onClick={handleClickOnSave}
            display={isSubmissionCommitted ? "none" : ""}
          >
            Save
          </Button>
        </HStack>
      </Form>
    </Box>
  );
};

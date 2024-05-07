import {
  Box,
  Button,
  HStack,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import {
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { IAnswer } from "../../client/models/answer";
import { ISubmissionPost as ISubmissionPostData } from "../../client/models/submission";
import { UserPublic } from "../../client/models/user";
import ConfirmationModal from "./ConfirmationModal";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { AxiosError } from "axios";
import useCustomToast from "../../hooks/useCustomToast";
import { QuizContext } from "../../context/QuizContextProvider";
import { QuizHeading } from "./QuizHeading";
import { QuestionsRenderer } from "./QuestionsRenderer";
import { useSubmission } from "../../hooks/useSubmission";

export const Quiz = () => {
  const context = useContext(QuizContext);

  // States used by the Quizz
  const [answers, setAnswers] = useState([] as IAnswer[]);
  const [isSubmissionCommitted, setIsSubmissionCommitted] = useState<boolean>(true);

  useEffect(() => {
    if (!context?.submission.isLoading) {
      setAnswers(context?.submission.data?.answers ?? [] as IAnswer[]);
      setIsSubmissionCommitted(context?.submission.data?.is_commited as boolean)
    }
  }, [
    context?.exam.isLoading,
    context?.submission.isLoading,
    context?.submission.data?.answers,
    context?.submission.data.is_commited
  ]);

  const { isOpen, onOpen: openConfirmationModal, onClose } = useDisclosure();

  // Hooks
  const { errorToast, unknownErrorToast, successToast } = useCustomToast();

  const { submissionMutation } = useSubmission()

  // Submit and Save handlers
  const saveAnswers = async (submission: ISubmissionPostData) => {
    const result = await submissionMutation.mutateAsync(submission);
    return result;
  };

  const generateSubmissionPostData = (isCommited: boolean = false) => {
    const userDataString = localStorage.getItem("userData");
    let userData;
    if (userDataString) {
      userData = JSON.parse(userDataString) as UserPublic;
    }

    return {
      exam_year: context?.exam.currentYear,
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
  if (context?.exam.isLoading || context?.submission.isLoading) {
    return <Spinner />;
  }

  if (!context?.exam.isOpenForSubmission) {
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
        <QuizHeading />
        <QuestionsRenderer
          questions={context.exam.data.questions}
          answers={answers}
          setAnswers={setAnswers}
          isCommitted={isSubmissionCommitted}
        />
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

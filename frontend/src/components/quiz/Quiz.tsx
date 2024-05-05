import { Box, Button, Divider, HStack, Heading, Text } from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { Question } from "./Question";
import { IQuestion } from "../../client/models/question";
import { FormEvent, FormEventHandler, MouseEventHandler, useState } from "react";

type QuizProps = {
  isOpenForSubmition: boolean,
  questions?: IQuestion[]
}

export const Quiz = ({ isOpenForSubmition, questions }: QuizProps) => {

  const handleSave: MouseEventHandler<HTMLButtonElement> = async (event: Event) => {
    const userDataString = localStorage.getItem("userData")
    let userData
    if (userDataString) {
      userData = JSON.parse(userDataString)
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
    event.preventDefault()

  }

  const [answers, setAnswers] = useState([] as Record<string,any>[])

  if (!isOpenForSubmition) {
    return (
      <Box>
        <Heading as="h2" fontSize="1.5em" mb={5}>
          You are here too early!
        </Heading>
        <Text>Looks like the quizz isn't available for submissions yet</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Form method="POST" onSubmit={handleSubmit}>
        <Heading as="h2" fontSize="1.5em" mb={5}>
          Heres the quizz!
        </Heading>
        <Text mb={5}>
          Please keep in mind that you can only submit this quizz once.
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
          <Button colorScheme="green" type="submit">Submit</Button>
          <Button onClick={handleSave}>Save</Button>
        </HStack>
      </Form>
    </Box>
  );
};

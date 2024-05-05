import { Box, Button, Divider, HStack, Heading, Text } from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { Question } from "./Question";
import { IQuestion } from "../../client/models/question";

type QuizProps = {
  isOpenForSubmition: boolean,
  questions?: IQuestion[]
}

export const Quiz = ({ isOpenForSubmition, questions }: QuizProps) => {
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
      <Form>
        <Heading as="h2" fontSize="1.5em" mb={5}>
          Heres the quizz!
        </Heading>
        <Text mb={5}>
          Please keep in mind that you can only commit this quizz once.
        </Text>
        <Divider mb={5} />
        {questions?.map((item, i) => (
          <Question
            key={item.id}
            index={i + 1}
            question={item.question}
            options={item.options}
          />
        ))}
        <HStack spacing={5}>
          <Button colorScheme="green">Submit</Button>
          <Button>Save</Button>
        </HStack>
      </Form>
    </Box>
  );
};

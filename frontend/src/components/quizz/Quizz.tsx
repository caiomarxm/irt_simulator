import { Box, Button, Divider, HStack, Heading, Text } from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { Question } from "./Question";

type QuizzProps = {
  isOpenForSubmition: boolean
}

export const Quizz = ({ isOpenForSubmition }: QuizzProps) => {
  const questions = [
    { question: "Question foo", options: ["1", "2", "3"] },
    { question: "Question bar", options: ["4", "5", "6"] },
    { question: "Question doe", options: ["7", "8", "9"] },
  ];

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
        {questions.map((item, i) => (
          <Question
            key={i}
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

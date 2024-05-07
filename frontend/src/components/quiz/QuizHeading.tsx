import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { QuizContext } from "../../context/QuizContextProvider";

export const QuizHeading = () => {
  const context = useContext(QuizContext);

  return (
    <>
      <Heading as="h2" fontSize="1.5em" mb={5}>
        Here's the quiz!
      </Heading>
      <Box display={context?.submission.data.is_commited ? "none" : ""}>
        <Text mb={5}>
          Please keep in mind that you can only submit this quiz once.
        </Text>
      </Box>
      <Box display={!context?.submission.data.is_commited ? "none" : ""}>
        <Text mb={5}>
          You've already submitted a response to this exam. You can still see
          your responses, but you won't be able to edit them.
        </Text>
      </Box>
      <Divider mb={5} />
    </>
  );
};

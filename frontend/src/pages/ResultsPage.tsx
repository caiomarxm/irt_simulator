import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useSubmission } from "../hooks/useSubmission";
import { colors } from "../theme";

export const ResultsPage = () => {
  const { data, isLoading } = useSubmission();

  if (isLoading) {
    return <Spinner />;
  }

  if (!data?.result) {
    return (
      <Box ml="10px">
        <Heading as="h3" fontSize="1.2rem" mb={5}>
          Exam Results
        </Heading>
        <Text>Sorry, it seems the results are not available yet.</Text>
        <Text>You will be notified as soon as the results are available.</Text>
      </Box>
    );
  }

  return (
    <Box ml="10px">
      <Heading as="h3" fontSize="1.2rem" mb={5}>
        Exam Results
      </Heading>
      <Text mb={5}>The exam results are available, check your grade bellow.</Text>
      <Card
        display="block"
        borderTop={`10px solid ${colors.background}`}
        maxW="250px"
      >
        <CardHeader fontSize="1.2rem">Your Grade</CardHeader>
        <CardBody>
          <Heading>{data?.result}</Heading> out of 1000
        </CardBody>
        <Divider />
        <CardFooter>
          {data?.result > 600 ? "You did very well!" : "Maybe next year..."}
        </CardFooter>
      </Card>
    </Box>
  );
};

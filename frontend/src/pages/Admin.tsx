import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { colors } from "../theme";
import { useCurrentExam } from "../hooks/useCurrentExam";

export const Admin = () => {
  const {
    data,
    isLoading,
    openExamMutation,
    closeExamMutation,
    commitExamMutation,
  } = useCurrentExam();

  if (isLoading) {
    return <Spinner />
  }

  const handleCommitExam = async () => {
    const result = await commitExamMutation.mutateAsync(data?.id as number);
    return result;
  };

  const handleOpenExam = async () => {
    const result = await openExamMutation.mutateAsync(data?.id as number);
    return result;
  };

  const handleCloseExam = async () => {
    const result = await closeExamMutation.mutateAsync(data?.id as number);
    return result;
  };

  return (
    <Box>
      <Menu>
        <MenuButton textAlign="left">
          <Card
            display="block"
            borderTop={`10px solid ${colors.background}`}
            maxW="250px"
          >
            <CardHeader fontSize="1.2rem">Exam - {data?.year}</CardHeader>
            <CardBody>{`Currently ${data?.is_closed ? "closed" : "open"} and ${data?.is_committed? "commited" : "not commited"}.`}</CardBody>
            <Divider color="gray.200" />
            <CardFooter>Click to manage the ongoing exam</CardFooter>
          </Card>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleOpenExam}>Open Exam</MenuItem>
          <MenuItem onClick={handleCloseExam}>Close Exam</MenuItem>
          <MenuItem onClick={handleCommitExam}>Commit Exam</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { Form } from "react-router-dom";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  return (
    <Form color="#2d2e3d">
      <Container
        bg="white"
        gap={4}
        alignItems="center"
        justifyContent="center"
        centerContent
        height="100vh"
        p="25px"
      >
        <Image src="./img/logo.png" h="auto" maxW="2xs" />
        <Heading as="h3" marginBottom="1.5rem">
          NHE Results
        </Heading>
        <FormControl>
          <FormLabel>E-mail</FormLabel>
          <Input type="email" name="email" />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input type={showPassword ? "text" : "password"} name="password" />
            <InputRightElement w="4.5rem">
              <Button size="sm" h="1.75rem" onClick={handleShowPasswordClick}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button type="submit">Login</Button>
      </Container>
    </Form>
  );
};

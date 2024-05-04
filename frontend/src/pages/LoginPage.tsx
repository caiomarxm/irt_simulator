import {
  Box,
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
import useAuth from "../hooks/useAuth";
import { AccessTokenRequestBody } from "../client/models/token";
import { Form } from "react-router-dom";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { loginMutation, error, resetError } = useAuth()

  const handleLogin = async (event: Event) => {
    event.preventDefault()
    resetError()
    try {
      const data = { username: username, password: password } as AccessTokenRequestBody
      await loginMutation.mutateAsync(data)
    } catch {
      //
    }
  }

  return (
    <Box bg="white">
      <Form color="#2d2e3d" onSubmit={handleLogin} >
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
          <FormControl id="username" isInvalid={!!error}>
            <FormLabel>E-mail</FormLabel>
            <Input type="email" name="email" onChange={(e) => setUsername(e.target.value)} />
          </FormControl>

          <FormControl id="password" isInvalid={!!error}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement w="4.5rem">
                <Button size="sm" h="1.75rem" onClick={handleShowPasswordClick} >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button type="submit">Login</Button>
        </Container>
      </Form>
    </Box>
  );
};

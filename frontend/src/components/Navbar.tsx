import {
  Avatar,
  Flex,
  Heading,
  Spacer,
  Text,
  useToast,
  Button,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { UserPublic } from "../client/models/user";

export const Navbar = () => {
  const toast = useToast();

  const { performLogout } = useAuth();
  const [user, setUser] = useState<UserPublic|null>(null)

  useEffect(() => {
    const userString: string = localStorage.getItem('userData') ?? ""
    const localStorageUserObject = JSON.parse(userString).data
    setUser(localStorageUserObject)
  }, [])

  return (
    <Flex as="nav" p="10px" mb="60px" alignItems="center">
      <Heading as="h1" fontSize="1.5em">
        Welcome, {user?.full_name?.split(" ")[0]}
      </Heading>
      <Spacer />
      <Flex wrap="wrap">
        <Avatar bg="blue.600" marginRight={5}></Avatar>
        <Text marginRight={5}>{user?.email}</Text>
        <Button
          colorScheme="blue"
          onClick={() => {
            performLogout();
            toast({
              title: "Logged out.",
              description: "Successfully logged out",
              duration: 10000,
              isClosable: true,
              position: "top",
              status: "success",
              icon: <UnlockIcon />,
            });
          }}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};

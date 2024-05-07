import {
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserPublic } from "../client/models/user";
import { AvatarMenu } from "./AvatarMenu";

export const Navbar = () => {
  const [user, setUser] = useState<UserPublic | null>(null);

  useEffect(() => {
    const userString: string = localStorage.getItem("userData") ?? "";
    const localStorageUserObject = JSON.parse(userString);
    setUser(localStorageUserObject);
  }, []);

  return (
    <Flex as="nav" p="10px" mb="30px" alignItems="center">
      <Heading as="h1" fontSize="1.5em">
        Welcome, {user?.full_name?.split(" ")[0]}
      </Heading>
      <Spacer />
      <Flex wrap="wrap" alignItems="center">
        <AvatarMenu />
      </Flex>
    </Flex>
  );
};

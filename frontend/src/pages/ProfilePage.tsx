import { Avatar, AvatarBadge, Box, FormControl, FormLabel, Input, Spinner, VStack } from "@chakra-ui/react";
import { colors } from "../theme";
import { Form } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

export const ProfilePage = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const { user, isLoading } = useAuth()

  useEffect(() => {
    setEmail(user?.data.email)
    setName(user?.data.full_name)
  }, [setEmail, setName, user])

  if ( isLoading ) {
    return <Spinner />
  }

  return (
    <Box display="block">
      <VStack>
        <Avatar bg={colors.background} size="xl" mb={10} >
          <AvatarBadge bg="white" >
            <EditIcon color={colors.background}/>
          </AvatarBadge>
        </Avatar>
        <Form>
          <FormControl id="email" mb={5}>
            <FormLabel>Email Address</FormLabel>
            <Input placeholder={email} variant={"filled"} isDisabled />
          </FormControl>
          <FormControl id="name">
            <FormLabel>Full Name</FormLabel>
            <Input placeholder={name} variant={"filled"} isDisabled />
          </FormControl>
        </Form>
      </VStack>
    </Box>
  );
};

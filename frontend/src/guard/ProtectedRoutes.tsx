import { Navigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { isAdminLoggedIn, isLoggedIn } from "../hooks/useAuth";

type Props = {
  children?: JSX.Element | JSX.Element[];
};

export const UserProtected = ({ children }: Props) => {
  const isUserLoggedIn = isLoggedIn();

  if (!isUserLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children
}

export const AdminProtected = ({ children }: Props) => {
  const isAdmin = isAdminLoggedIn()
  const toast = useToast()

  if (!isAdmin) {
    toast({
      colorScheme: "red",
      title: "Forbidden",
      description: "You are not allowed on this route",
      isClosable: true,
      duration: 3000,
      position: "top",
    })
    return <Navigate to="/" />
  }

  return children
}

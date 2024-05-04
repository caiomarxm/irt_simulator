import { Button } from "@chakra-ui/react";
import { UserService } from "../client/services/userService";
import useAuth from "../hooks/useAuth";

export const Admin = () => {
  const handleClick = async () => {
    const user = await UserService.readUserMe()
    alert(JSON.stringify(user));
  };

  const { performLogout } = useAuth()

  return (
    <>
      <div>Admin</div>
      <Button onClick={handleClick}>Test User</Button>
      <Button onClick={performLogout}>Logout</Button>
    </>
  );
};

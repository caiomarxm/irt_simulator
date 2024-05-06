import {
  Avatar,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { UserPublic } from "../client/models/user";
import { UnlockIcon } from "@chakra-ui/icons";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const ProfileMenu = () => {
  const userDataString = localStorage.getItem("userData");
  let user;
  if (userDataString) {
    user = JSON.parse(userDataString) as UserPublic;
  }

  const navigate = useNavigate();

  const toast = useToast();
  const { performLogout } = useAuth();

  return (
    <Menu>
      <MenuButton>
        <Avatar />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
        <MenuItem
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
        </MenuItem>
        {user?.is_superuser && (
          <>
            <Divider />
            <MenuItem onClick={() => navigate("/admin")}>Admin</MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

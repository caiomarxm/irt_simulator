import { BellIcon } from "@chakra-ui/icons";
import { GenericAvatarIcon, List, ListIcon, ListItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <List colorScheme="blue" color="white" p="15px" spacing={4}>
      <ListItem>
        <NavLink to="/">
          <ListIcon as={GenericAvatarIcon} />
          Current Exam
        </NavLink>
      </ListItem>

      <ListItem>
        <NavLink to="results">
          <ListIcon as={BellIcon} />
          Current Results
        </NavLink>
      </ListItem>

      <ListItem>
        <NavLink to="previous-results">
          <ListIcon as={GenericAvatarIcon} />
          Previous Results
        </NavLink>
      </ListItem>
    </List>
  );
};

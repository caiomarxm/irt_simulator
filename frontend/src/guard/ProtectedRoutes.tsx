import { Navigate } from "react-router-dom";
import { isAdminLoggedIn, isLoggedIn } from "../hooks/useAuth";

type Props = {
  children?: JSX.Element | JSX.Element[];
};

export const UserProtected = ({ children }: Props) => {
  const isUserLoggedIn = isLoggedIn();

  if (!isUserLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminProtected = ({ children }: Props) => {
  const isAdmin = isAdminLoggedIn();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

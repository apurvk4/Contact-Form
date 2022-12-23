import { createContext } from "react";

const UserContext = createContext({
  loggedIn: false,
  data: {},
  loginSuccess: () => {},
  logout: () => {},
});
export default UserContext;

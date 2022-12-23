import { useState } from "react";
import UserContext from "./userContext";
const UserProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState({});
  function loginSuccess(val) {
    setLoggedIn(true);
    setData(val);
  }
  function logout() {
    setLoggedIn(false);
    setData({});
  }
  return (
    <UserContext.Provider value={{ loggedIn, data, loginSuccess, logout }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default UserProvider;

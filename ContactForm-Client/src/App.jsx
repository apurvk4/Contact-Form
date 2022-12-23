import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./Components/Loading/Loading";
// import reactLogo from "./assets/react.svg";
import "./App.css";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "./contexts/userContext";
const Contact = lazy(() => import("./Components/contact"));
const Login = lazy(() => import("./Components/Login"));
const Singup = lazy(() => import("./Components/Signup"));
function App() {
  const [loading, setLoading] = useState(true);
  const { loginSuccess } = useContext(UserContext);
  async function verify() {
    const url = import.meta.env.VITE_DEPLOYMENT + "/api/verifytoken";
    let res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    if (res.status === 200) {
      res = await res.json();
      // console.log(res);
      loginSuccess(res.user);
    }
    setLoading(false);
  }
  useEffect(() => {
    verify();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<Loading />}>
                  <Singup />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<Loading />}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<Loading />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<Loading />}>
                  <Singup />
                </Suspense>
              }
            />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;

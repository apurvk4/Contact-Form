import Input from "./Input/Input";
import Modal from "./Modal/Modal";
import "../index.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
const Login = () => {
  const { loginSuccess, loggedIn } = useContext(UserContext);
  const [email, setEmail] = useState({
    isValid: true,
    message: "",
    data: "",
  });
  const [password, setPassword] = useState({
    isValid: true,
    message: "",
    data: "",
  });
  const [login, setLogin] = useState({
    isValid: true,
    message: "",
    data: {
      loggedin: false,
      value: {},
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedIn) {
      navigate("/contact");
    }
  }, [loggedIn, navigate]);
  useEffect(() => {
    if (loading) {
      setLogin({ ...login, isValid: false, message: "loading ..." });
    }
  }, [loading]);
  async function checkEmail() {
    let val = String(email.data)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!val) {
      setEmail({ ...email, isValid: false, message: "Invalid Email" });
    } else {
      const url =
        import.meta.env.VITE_DEPLOYMENT + "/api/verifyemail/" + email.data;
      try {
        setEmail({
          ...email,
          isValid: false,
          message: "verifying...",
        });
        let res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        if (res.status === 200) {
          res = await res.json();
          setEmail({
            ...email,
            isValid: false,
            message: res.message ?? "no account associated with this email",
          });
        } else if (res.status === 400) {
          setEmail({ ...email, isValid: true, message: "Valid Email" });
        } else {
          setEmail({
            ...email,
            isValid: false,
            message: res.message ?? "there was an error",
          });
        }
      } catch (err) {
        setEmail({
          ...email,
          isValid: false,
          message: err.message ?? "there was an error",
        });
      }
    }
    if (!login.isValid) {
      setLogin({ ...login, isValid: true, message: "user is entering data" });
    }
  }

  async function submit() {
    checkEmail();
    if (email.isValid) {
      setLoading(true);
      const val = import.meta.env.VITE_DEPLOYMENT + "/api/login";
      let res = await fetch(val, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.data,
          password: password.data,
        }),
      });
      if (res.status === 200) {
        setLoading(false);
        alert("login success");
        res = await res.json();
        loginSuccess(res.user);
        navigate("/contact");
      } else {
        res = await res.json();
        setLogin({
          ...login,
          isValid: false,
          message: res.message ?? "there was an error !!",
          data: {
            value: {},
            loggedin: false,
          },
        });
        setLoading(false);
      }
    }
  }
  return (
    <Modal outsideclick="notallow" darken={true} modalTop={false}>
      <div className="tweetbody">
        <div
          className="tweetbodytext"
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontWeight: 900,
              fontSize: "35px",
            }}
          >
            Log In
          </p>
          <div
            style={{
              width: "300px",
              display: "flex",
              position: "relative",
            }}
          >
            <span
              style={{
                display: "inline",
                width: "100%",
                backgroundColor: "var(--accent-color)",
                height: "1px",
              }}
            ></span>
            <span style={{ height: "5px" }}></span>

            <span
              style={{
                display: "inline",
                width: "100%",
                backgroundColor: "var(--accent-color)",
                height: "1px",
              }}
            ></span>
          </div>

          <Input
            invalidText={email.message}
            isValid={email.isValid}
            placeholder={"Email"}
            label="Email"
            type={"email"}
            value={email.data}
            onInput={(e) => {
              setEmail({ ...email, data: e.target.value });
            }}
            onBlur={() => {
              checkEmail();
            }}
          />
          <Input
            invalidText={""}
            isValid={true}
            placeholder={"Password"}
            label="Password"
            type={"password"}
            value={password.data}
            onInput={(e) => {
              setPassword({ ...password, data: e.target.value });
              if (!login.isValid) {
                setLogin({
                  ...login,
                  isValid: true,
                  message: "user is entering password",
                });
              }
            }}
          />
          {!login.isValid ? (
            <span
              style={{
                color: "#dc3545",
                width: "300px",
                alignSelf: "center",
              }}
            >
              {login.message}
            </span>
          ) : (
            ""
          )}
          <button
            className="loginnext"
            type="submit"
            disabled={!email.isValid || !password.isValid}
            onClick={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            Submit
          </button>
          <p>
            Don't have an account?
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "var(--accent-color)",
              }}
            >
              Sing up
            </Link>
          </p>
        </div>
      </div>
    </Modal>
  );
};
export default Login;

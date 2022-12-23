import Input from "./Input/Input";
import Modal from "./Modal/Modal";
import "../index.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
const Signup = () => {
  const { loggedIn } = useContext(UserContext);
  const [name, setName] = useState({
    isValid: true,
    message: "",
    data: "",
  });
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
  const [signup, setSignup] = useState({
    isValid: true,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedIn) {
      navigate("/signup");
    } else {
      navigate("/contact");
    }
  }, [loggedIn, navigate]);
  useEffect(() => {
    if (loading) {
      setSignup({ isValid: false, message: "loading ..." });
    }
  }, [loading]);
  function checkName() {
    let val = name.data;
    if (val.length <= 4) {
      setName({ ...name, isValid: false, message: "Name is too short" });
      return;
    }
    setName({ ...name, isValid: true, message: "Name is valid" });
  }
  // function checkEmail() {
  //   let val = String(email.data)
  //     .toLowerCase()
  //     .match(
  //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //     );
  //   if (!val) {
  //     setEmail({ ...email, isValid: false, message: "Invalid Email" });
  //   } else {
  //     setEmail({ ...email, isValid: true, message: "Valid Email" });
  //   }
  // }
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
            isValid: true,
            message: res.reason,
          });
        } else if (res.status === 400) {
          res = await res.json();
          setEmail({
            ...email,
            isValid: false,
            message: res.reason,
          });
        } else {
          res = await res.json();
          setEmail({
            ...email,
            isValid: false,
            message: res.reason ?? "there was an error",
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
    if (!signup.isValid) {
      setSignup({ ...signup, isValid: true, message: "user is entering data" });
    }
  }
  function checkPassword() {
    let val = password.data;
    if (val.length <= 5) {
      setPassword({
        ...password,
        isValid: false,
        message: "Password is too short",
      });
      return;
    }
    setPassword({ ...password, isValid: true, message: "Password is valid" });
  }
  async function submit() {
    checkName();
    checkEmail();
    checkPassword();
    if (name.isValid && email.isValid && password.isValid) {
      setLoading(true);
      const val = import.meta.env.VITE_DEPLOYMENT + "/api/signup";
      let res = await fetch(val, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.data,
          name: name.data,
          password: password.data,
        }),
      });
      if (res.status === 201) {
        setLoading(false);
        setSignup({ isValid: true, message: "Signup success!!" });
        alert("signup success");
        navigate("/login");
      } else {
        res = await res.json();
        setLoading(false);
        setSignup({
          isValid: false,
          message: res.message ?? "there was an error !!",
        });
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
            Sign Up
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
            invalidText={name.message}
            isValid={name.isValid}
            placeholder={"Name"}
            label="Name"
            type={"text"}
            value={name.data}
            onInput={(e) => {
              setName({ ...name, data: e.target.value });
            }}
            onBlur={(e) => {
              checkName();
            }}
          />

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
            invalidText={password.message}
            isValid={password.isValid}
            placeholder={"Password"}
            label="Password"
            type={"password"}
            value={password.data}
            onInput={(e) => {
              setPassword({ ...password, data: e.target.value });
            }}
            onBlur={() => {
              checkPassword();
            }}
          />
          {!signup.isValid ? (
            <span
              style={{
                color: "#dc3545",
                width: "300px",
                alignSelf: "center",
              }}
            >
              {signup.message}
            </span>
          ) : (
            ""
          )}
          <button
            className="loginnext"
            type="submit"
            disabled={!name.isValid || !email.isValid || !password.isValid}
            onClick={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            Submit
          </button>
          <p>
            Already have an account?
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--accent-color)",
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Modal>
  );
};
export default Signup;

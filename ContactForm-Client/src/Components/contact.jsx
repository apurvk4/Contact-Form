import "../index.css";
import Modal from "./Modal/Modal";
import Input from "./Input/Input";
import { useState } from "react";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const { loggedIn, data, logout } = useContext(UserContext);
  const [name, setName] = useState({
    isValid: true,
    message: "",
    data: "",
  });
  const [phone, setPhone] = useState({
    isValid: true,
    message: "",
    data: "",
  });
  const [email, setEmail] = useState({
    isValid: true,
    message: "",
    data: "",
  });
  const [url, setUrl] = useState({
    isValid: true,
    message: "",
    data: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);
  function checkName() {
    let val = name.data;
    if (val.length <= 4) {
      setName({ ...name, isValid: false, message: "Name is too short" });
      return;
    }
    setName({ ...name, isValid: true, message: "name is valid" });
  }
  function checkPhone() {
    let val = String(email.data).match(
      /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
    );
    if (val) {
      setPhone({ ...phone, isValid: true, message: "valid Phone Number" });
    } else {
      setPhone({ ...phone, isValid: false, message: "Invalid Phone Number" });
    }
  }
  function checkEmail() {
    let val = String(email.data)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!val) {
      setEmail({ ...email, isValid: false, message: "Invalid Email" });
    } else {
      setEmail({ ...email, isValid: true, message: "Valid Email" });
    }
  }
  function checkUrl() {
    try {
      const val = new URL(url.data);
      if (val.host === "linkedin.com") {
        setUrl({ ...url, isValid: true, message: "Url Is Valid" });
      } else {
        setUrl({
          ...url,
          isValid: false,
          message: "invalid url or url doesnot belong to linkedin",
        });
      }
    } catch (err) {
      setUrl({
        ...url,
        isValid: false,
        message: err.message,
      });
    }
  }
  async function submit() {
    checkEmail();
    checkName();
    checkPhone();
    checkUrl();
  }
  async function logoutUser() {
    const url = import.meta.env.VITE_DEPLOYMENT + "/api/logout";
    let res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    if (res.status === 201) {
      logout();
      alert("logout successful");
    } else {
      res = await res.json();
      alert(res.message ?? "there was an error logging out");
    }
  }
  return (
    <>
      <div className="fixedNav">
        <div className="nav">
          <span
            className="nav-data"
            style={{ fontWeight: "700", fontSize: "30px" }}
          >
            Hello {data.name}
          </span>
          <button style={{ maxHeight: "53px" }} onClick={logoutUser}>
            Logout
          </button>
        </div>
      </div>
      <Modal outsideclick="notallow" darken={true} modalTop={false}>
        <form className="tweetbody">
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
              Contact Form
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
              invalidText={phone.message}
              isValid={phone.isValid}
              placeholder={"Phone"}
              label="Phone"
              type={"text"}
              value={phone.data}
              onInput={(e) => {
                setPhone({ ...phone, data: e.target.value });
              }}
              onBlur={(e) => {
                checkPhone();
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
              invalidText={url.message}
              isValid={url.isValid}
              placeholder={"LinkedIn Id"}
              label="LinkedIn Id"
              type={"url"}
              value={url.data}
              onInput={(e) => {
                setUrl({ ...url, data: e.target.value });
              }}
              onBlur={() => {
                checkUrl();
              }}
            />
            <button
              className="loginnext"
              type="submit"
              disabled={
                !name.isValid ||
                !phone.isValid ||
                !email.isValid ||
                !url.isValid
              }
              onClick={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default Contact;

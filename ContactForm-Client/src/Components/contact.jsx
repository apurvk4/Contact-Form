import "../index.css";
import Modal from "./Modal/Modal";
import { useState } from "react";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const { loggedIn, data, logout } = useContext(UserContext);
  const [fileSelected, setFileSelected] = useState({
    status: false,
    name: "",
    type: "",
    file: null,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);
  async function submit() {
    if (fileSelected.status) {
      const url = import.meta.env.VITE_DEPLOYMENT + "/api/import";
      let data = new FormData();
      data.append("file", fileSelected.file);
      let res = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: data,
      });
      if (res.status === 200) {
        alert("file uploaded");
      } else {
        res = await res.json();
        alert(res.message);
      }
    }
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
          <button onClick={() => navigate("/list")}>Contacts</button>
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
              Import Contacts
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
            <div
              style={{
                width: "300px",
                display: "flex",
                flexDirection: "column",
                marginTop: "15px",
                height: "60px",
                borderRadius: "10px",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--default-border)",
                fontSize: "18px",
              }}
              role="button"
              onClick={(e) => {
                let inp = e.currentTarget.firstElementChild;
                inp.click();
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                accept="csv, text/csv"
                onChange={(e) => {
                  e.stopPropagation();
                  let file = e.target.files[0];
                  setFileSelected({
                    status: true,
                    name: file.name,
                    type: file.type,
                    file: file,
                  });
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                }}
              >
                {fileSelected.status ? fileSelected.name : "Upload CSV File"}
              </span>
            </div>

            <button
              className="loginnext"
              type="submit"
              disabled={!fileSelected.status}
              onClick={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              Import
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default Contact;

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import Loading from "../Loading/Loading";
import Modal from "../Modal/Modal";
import "../../index.css";
const titles = ["name", "email", "phone", "linkedin url"];
const Table = () => {
  // const [sortby, setSortBy] = useState({ type: "", index: -1 });
  const { loggedIn, logout, data } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  // const theads = {
  //   clicks:
  //   date: processDates,
  //   requests:
  //   responses:
  //   impressions:
  //   revenue: processRevenue,
  // };
  async function getList() {
    let url = import.meta.env.VITE_DEPLOYMENT + "/api/contacts";
    let p = new URLSearchParams({ limit, skip });
    url = url + "?" + p.toString();
    try {
      setLoading(true);
      let res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      res = await res.json();
      setRows(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  }
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    } else {
      getList();
    }
  }, [loggedIn, page]);

  function displayRows() {
    // const rows = getRows();
    if (rows.length == 0) {
      alert("no data to show. First import data !!");
    }
    let res = [];
    for (let i = 0; i < rows.length; i++) {
      let l = [];
      for (let j = 0; j < titles.length; j++) {
        l.push(<td data-th={titles[j]}>{rows[i][titles[j]]}</td>);
      }
      if (l.length) {
        res.push(<tr>{l}</tr>);
      }
    }
    return res;
  }
  function getNext() {
    // setPage(page + 1);
    // let temp = { ...setFullParams(searchParams), page: page + 1 };
    // setSearchParams(temp);
    // window.history.pushState(
    //   {},
    //   "",
    //   window.location.pathname + new URLSearchParams(searchParams).toString()
    // );
    setSkip(skip + limit);
    setPage(page + 1);
  }
  function getPrev() {
    // setPage(page - 1);
    // if (page > 1) {
    //   let temp = { ...setFullParams(searchParams), page: page - 1 };
    //   setSearchParams(temp);
    //   window.history.back();
    // }
    if (page > 1) {
      setSkip(skip - limit);
      setPage(page - 1);
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
          <button onClick={() => navigate("/list")}>List Contacts</button>
          <button style={{ maxHeight: "53px" }} onClick={logoutUser}>
            Logout
          </button>
        </div>
      </div>
      <Modal outsideclick="notallow" darken={true} modalTop={false}>
        <>
          <table className="rwd-table" style={{ background: "inherit" }}>
            <thead>
              <tr>
                {titles.map((title, i) => {
                  return (
                    <th key={i} scope="col">
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{loading ? <Loading /> : displayRows()}</tbody>
          </table>
          <div
            className="w-100 d-flex justify-content-center"
            style={{ borderTop: "2px solid black" }}
          >
            <ul className="pagination" style={{ marginTop: "1em" }}>
              <li className="page-item">
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={getPrev}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              <li className="page-item">
                <button className="page-link">{page}</button>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  aria-label="Next"
                  onClick={getNext}
                >
                  <span aria-hidden="true">»</span>
                </button>
              </li>
            </ul>
          </div>
        </>
      </Modal>
    </>
  );
};
export default Table;

import { Component, cloneElement } from "react";
import dom from "react-dom";
import {
  overlay,
  overlaynoBg,
  disablescroll,
  container0,
  container,
  modaltop,
  modalclose,
} from "./Modal.module.css";
const modalRoot = document.getElementById("modal-root");

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }
  componentDidMount() {
    if (this.props.darken) {
      this.el.classList.add(overlay);
    } else {
      this.el.classList.add(overlaynoBg);
    }
    modalRoot.appendChild(this.el);
    if (this.props.outsideclick === "allow") {
      this.el.addEventListener("click", (e) => {
        if (e.currentTarget === e.target) {
          this.props.close();
        }
        e.stopPropagation();
      });
    }
    document.getElementById("root").classList.add(disablescroll);
  }
  componentDidUpdate() {
    if (this.props.darken) {
      this.el.classList.add(overlay);
    } else {
      this.el.classList.add(overlaynoBg);
    }
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    this.el.removeEventListener("click", (e) => {
      if (e.currentTarget === e.target) {
        this.props.close();
      }
    });
    document.getElementById("root").classList.remove(disablescroll);
  }
  render() {
    return dom.createPortal(
      <div className={container0}>
        <div className={container} style={{ padding: "0px", height: "100%" }}>
          {this.props.modalTop ? (
            <div className={modaltop}>
              <b>{this.props.header}</b>
              <button className={modalclose} onClick={this.props.close}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          ) : (
            ""
          )}
          <div style={{ paddingLeft: "12px", paddingRight: "12px" }}>
            {cloneElement(this.props.children, { ...this.props })}
          </div>
        </div>
      </div>,
      this.el
    );
  }
}

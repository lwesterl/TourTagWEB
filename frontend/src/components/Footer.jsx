import React from "react";

/**
  *   Create a sticky footer
  */
  const style = {
      backgroundColor: "#202025",
      textAlign: "center",
      position: "fixed",
      left: "0",
      bottom: "0",
      height: "30px",
      width: "100%",
  }

  const phantom = {
    display: "block",
    height: "30px",
    width: "100%",
  }

export default function Footer({ children }) {
      return (
          <div>
              <div style={phantom} />
              <div style={style}>
                  { children }
              </div>
          </div>
      )
  }

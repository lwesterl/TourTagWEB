import React, { useEffect } from "react";
import { setStoredState } from "../App/App";


/**
  *   Logout user and redirect to the index page
  */
export default function Logout(props) {

    // Log the user out after the component has properly mounted
    useEffect(() => {
      props.userHasAuthenticated(false);
      setStoredState("authState", false);
      props.history.push("/"); // redirect
    });
    return (
      <h2 className="centered">Logging out...</h2>
    );
}

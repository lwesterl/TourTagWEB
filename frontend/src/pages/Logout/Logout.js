import React, { useEffect } from "react";


/**
  *   Logout user and redirect to the index page
  */
export default function Logout(props) {

    // Log the user out after the component has properly mounted
    useEffect(() => {
      props.userHasAuthenticated(false);
      props.history.push("/"); // redirect
    });
    return (
      <h2>Logging out...</h2>
    );
}

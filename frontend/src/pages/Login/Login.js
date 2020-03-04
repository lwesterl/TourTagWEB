import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

import { setStoredState } from "../App/App";
import "./Login.css";


export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function formSubmit(event) {
    event.preventDefault();
    let auth_ok = false;
    // TODO:  Try to login to the backend here
    if (!auth_ok) {
      props.userHasAuthenticated(true);
      setStoredState("authState", true);
      setStoredState("username", username);
      props.history.push("/trip"); // redirect
    }
    else {
      const element = (
        <div id="error_div">
        <h2>Incorrect username or password</h2>
        </div>
      );
      ReactDOM.render(element, document.getElementById("error_div"));
    }
  }

  if (props.isAuthenticated) {
    return <Redirect push to="/"/>;
  }

  return (
    <div>
      <h2 className="title">Login</h2>
      <div id="error_div"/>
      <form onSubmit={formSubmit} className="form">
        <FormGroup>
          <FormLabel>Username:</FormLabel>
          <FormControl style={{marginBottom: "3%"}}
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="form"
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password:</FormLabel>
          <FormControl style={{marginBottom: "3%"}}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="form"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

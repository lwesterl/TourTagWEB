import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

import { setStoredState } from "../App/App";
import { API_Route } from "../../Routes";
import "./Login.css";


// Login page
export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  // Login form submit handler
  async function formSubmit(event) {
    event.preventDefault();
    const res = await fetch(API_Route + `/user/login?user=${username}&pw=${password}`,
    {
        method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    const content = await res.json();
    const status = JSON.parse(content);
    if (status === 200) {
      props.userHasAuthenticated(true);
      setStoredState("authState", true);
      setStoredState("username", username);
      // Update App authState
      props.userHasAuthenticated(true);
      props.setUsername(username);
      props.history.push("/trip"); // redirect
    }
    else {
      const element = (
        <div className="centered">
          <p>Incorrect username or password</p>
        </div>
      );
      ReactDOM.render(element, document.getElementById("error_div"));
    }
  }

  // Redirect immediately to the index page
  if (props.isAuthenticated) {
    return <Redirect push to="/"/>;
  }

  return (
    <div>
      <h2 className="title">Login</h2>
      <div id="error_div"/>
      <form onSubmit={formSubmit} className="form">
        <FormGroup>
          <FormLabel className="form">Username:</FormLabel>
          <FormControl style={{marginBottom: "3%"}}
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="form"
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel className="form">Password:</FormLabel>
          <FormControl style={{marginBottom: "3%"}}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="form"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} className="form" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

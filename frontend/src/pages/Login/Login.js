import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

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

  return (
    <div>
      <div id="error_div"/>
      <form onSubmit={formSubmit}>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

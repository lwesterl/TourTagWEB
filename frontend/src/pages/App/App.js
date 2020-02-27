import React, {useState} from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

import Routes from "../../Routes";


export function setStoredState(name, state) {
  localStorage.setItem(name, state);
}

export function getStoredState(name) {
  return localStorage.getItem(name);
}

/**
  *   Initial app page (connected to index.html)
  *   Routes to other pages
  */
export default function App(props) {
  let authState = getStoredState('authState') === "true" ? true : false;
  const [isAuthenticated, userHasAuthenticated] = useState(authState);

  return (
    <Router>
    <div>
      <ul>
        <li><Link to="/">TourStatus</Link></li>
        <li><Link to="/trip">Trip</Link></li>
        {isAuthenticated && <li><Link to="/logout">Logout</Link></li>}
      </ul>
      {isAuthenticated && <h4>Hello, {getStoredState("username")}</h4>}
      <Routes authProps={{ isAuthenticated, userHasAuthenticated }}/>
    </div>
    </Router>
  );
}

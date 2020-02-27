import React, {useState} from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

import Routes from "../../Routes";


/**
  *   Initial app page (connected to index.html)
  *   Routes to other pages
  */
export default function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  return (
    <Router>
    <div>
      <ul>
        <li><Link to="/">TourStatus</Link></li>
        <li><Link to="/trip">Trip</Link></li>
        {isAuthenticated && <li><Link to="/logout">Logout</Link></li>}
      </ul>
      <Routes authProps={{ isAuthenticated, userHasAuthenticated }}/>
    </div>
    </Router>
  );
}

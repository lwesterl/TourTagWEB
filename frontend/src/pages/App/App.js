import React, {useState} from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import Routes from "../../Routes";
import Footer from "../../components/Footer";


const LogoImage = "./TourTag_logo192.png";

export function setStoredState(name, state) {
  localStorage.setItem(name, state);
}

export function getStoredState(name) {
  return localStorage.getItem(name);
}

const year = new Date().getFullYear();

/**
  *   Initial app page (connected to index.html)
  *   Routes to other pages
  */
export default function App(props) {
  let authState = getStoredState('authState') === "true" ? true : false;
  const [isAuthenticated, userHasAuthenticated] = useState(authState);

  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand>
          <img
            src={process.env.PUBLIC_URL + LogoImage}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">TourStatus</Nav.Link>
            <Nav.Link href="/trip">Trip</Nav.Link>
            {isAuthenticated &&
              <Nav.Link href="/logout">Logout</Nav.Link>
            }
          </Nav>
          {isAuthenticated && <p>Hello, {getStoredState("username")}!</p>}
        </Navbar.Collapse>
      </Navbar>
      <Router>
        <Routes authProps={{ isAuthenticated, userHasAuthenticated }}/>
      </Router>
      <Footer>
        <p>© {year} TourTag</p>
      </Footer>
    </div>
  );
}

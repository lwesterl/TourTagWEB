import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import AuthRoute from "./components/AuthRoute";
import NotFound from "./components/NotFound";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import TourStatus from "./pages/TourStatus/TourStatus";
import Trip from "./pages/Trip/Trip";

// Set route for API requests, use this as basis for every API call
export const API_Route = process.env.NODE_ENV === "production" ? "/api" : "//localhost:8080";


/**
  *   Show a login page before accessing Trip page
  */
const PrivateRoute = ({ component: Component, authProps, ...rest }) => (
  <Route {...rest} render={(props) => (
    authProps.isAuthenticated === true ? <Component {...props} {...authProps}/> : <Redirect to='/login'/>
  )} />
)

/**
  *   Create routes between the pages
  */
export default function Routes({ authProps }) {
  return (
    <Switch>
      <AuthRoute path="/" exact component={TourStatus} authProps={authProps}/>
      <PrivateRoute path="/trip" exact component={Trip} authProps={authProps}/>
      <AuthRoute path="/login" exact component={Login} authProps={authProps}/>
      <AuthRoute path="/logout" exact component={Logout} authProps={authProps}/>
      <Route component={NotFound}/>
    </Switch>
  );
}

import React from "react";
import { Route } from "react-router-dom";

export default function AuthRoute({ component: Component, authProps, ...rest}) {
  return (
    <Route {...rest} render={props => <Component {...props} {...authProps}/>}/>
  );
}

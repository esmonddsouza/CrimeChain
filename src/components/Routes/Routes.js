import React from "react";
import { Switch, Route } from "react-router-dom";
import Admin from "../Admin/Admin";
import Dashboard from "../Dashboard/Dashboard"

export default function Routes() {
  return (
    <Switch>
      <Route path = "/Admin" exact component = { Admin } />
      <Route path = "/Dashboard" exact component = { Dashboard } />
      <Route component = { Dashboard } />
    </Switch>
  );
}

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GlobalStyles from './globalStyles';
import Home from './modules/Home';
import RoomWrapper from './modules/Room';

const App = () => {
  return (
    <Router>
      <GlobalStyles />

      <RouterSwitch />
    </Router>
  );
};

const RouterSwitch = () => {
  return (
    <Switch>
      <Route path="/room/:id">
        <RoomWrapper />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default App;
